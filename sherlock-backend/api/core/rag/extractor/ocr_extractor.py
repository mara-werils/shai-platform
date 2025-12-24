import logging
from collections.abc import Iterator
from typing import Optional, cast
from uuid import uuid4

import requests

from core.rag.extractor.extractor_base import BaseExtractor
from core.rag.models.document import Document

logger = logging.getLogger(__name__)


class OcrExtractor(BaseExtractor):
    """
    Клиент для единственного OCR эндпоинта DotsOCR:

        POST {ocr_api_url}/parse-file
        multipart/form-data:
            file=@<binary>

        Пример ответа (200 OK, application/json):
        {
          "filename": "2025-09-18_114742 (1)-1-10.pdf",
          "results": [
            {
              "page_no": 0,
              "markdown_content": "..."
            },
            ...
          ]
        }

    Поведение:
      * Не "fail-fast": при любой ошибке логируем и возвращаем [Document(page_content="")].
      * Ожидаем JSON, но в случае проблем используем resp.text как фолбэк.
    """

    def __init__(
        self,
        ocr_api_url: str,
        file_path: str,
        file_extension: str,
        *,
        timeout_seconds: int = 60,
    ):
        self._base = (ocr_api_url or "").rstrip("/")
        # В Swagger путь без завершающего слеша: /parse-file
        self._endpoint = f"{self._base}/parse-file"
        self._file_path = file_path
        self._file_extension = file_extension or ""
        self._timeout = timeout_seconds

    def extract(self) -> list[Document]:
        if not self._base:
            logger.warning("OCR_API_URL is empty; skipping OCR and returning empty text.")
            return [Document(page_content="")]

        try:
            with open(self._file_path, "rb") as fh:
                files = {
                    "file": (
                        f"{uuid4()}{self._file_extension}",
                        fh,
                        "application/pdf"
                        if self._file_extension.lower() == ".pdf"
                        else "application/octet-stream",
                    )
                }
                # Можно явно запросить JSON, но это не обязательно:
                # headers = {"Accept": "application/json"}
                resp = requests.post(
                    self._endpoint,
                    files=files,
                    timeout=self._timeout,
                    # headers=headers,
                )

            ctype = (resp.headers.get("content-type") or "").lower()

            if resp.status_code != 200:
                preview = (resp.text or "")[:500]
                logger.warning(
                    "External OCR failed (status=%s, ctype=%s, preview=%r)",
                    resp.status_code,
                    ctype,
                    preview,
                )
                return [Document(page_content="")]

            # --- Основной путь: JSON от DotsOCR ---
            if "application/json" in ctype:
                try:
                    data = resp.json()
                except Exception as e:  # JSON decode error
                    logger.warning("OCR JSON decode failed: %s", e)
                    text = (resp.text or "").lstrip("\ufeff").strip()
                    return [Document(page_content=text)] if text else [Document(page_content="")]

                pages: list[str] = []

                try:
                    # 1) Новый формат DotsOCR: { "filename": "...", "results": [ { "page_no": ..., "markdown_content": "..." }, ... ] }
                    if isinstance(data, dict):
                        results = data.get("results")
                        if isinstance(results, list):
                            for item in results:
                                if not isinstance(item, dict):
                                    continue
                                content = item.get("markdown_content")
                                if isinstance(content, str) and content.strip():
                                    pages.append(content.strip())

                    # 2) Backward-compat: старый формат { "result": [ { "page": ..., "content": "..." }, ... ] }
                    if not pages and isinstance(data, dict):
                        legacy_result = data.get("result")
                        if isinstance(legacy_result, list):
                            for item in legacy_result:
                                if not isinstance(item, dict):
                                    continue
                                content = item.get("content")
                                if isinstance(content, str) and content.strip():
                                    pages.append(content.strip())

                    # 3) Ещё один fallback: { "content": "..." }
                    if not pages and isinstance(data, dict):
                        single = data.get("content")
                        if isinstance(single, str) and single.strip():
                            pages.append(single.strip())

                except Exception as e:
                    # best-effort: игнорим частичные ошибки парсинга
                    logger.warning("Error while parsing OCR JSON structure: %s", e)

                if pages:
                    # Склеиваем всё в один Document, чтобы дальше RAG работал как раньше
                    return [Document(page_content="\n\n".join(pages))]
                else:
                    logger.warning(
                        "OCR JSON response did not contain expected text fields "
                        "('results[].markdown_content' or legacy 'result[].content')."
                    )
                    return [Document(page_content="")]

            # --- Фолбэк: трактуем тело как текст ---
            text = (resp.text or "").lstrip("\ufeff").strip()
            if text:
                return [Document(page_content=text)]

            logger.warning(
                "OCR returned empty body (status=200, ctype=%s, bytes=%s)",
                ctype,
                len(resp.content),
            )
            return [Document(page_content="")]

        except Exception as e:
            logger.warning("External OCR exception: %s", e)
            return [Document(page_content="")]


# ---------------- Optional: PDF text extractor kept as-is ----------------

from core.rag.extractor.blob.blob import Blob
from extensions.ext_storage import storage


class PdfExtractor(BaseExtractor):
    """Load pdf files to text pages via pypdfium2 without implicit redirect warnings."""

    def __init__(self, file_path: str, file_cache_key: Optional[str] = None):
        self._file_path = file_path
        self._file_cache_key = file_cache_key

    def extract(self) -> list[Document]:
        plaintext_file_exists = False
        if self._file_cache_key:
            try:
                text = cast(bytes, storage.load(self._file_cache_key)).decode("utf-8")
                plaintext_file_exists = True
                return [Document(page_content=text)]
            except FileNotFoundError:
                pass

        documents = list(self.load())
        text_list = [d.page_content for d in documents]
        text = "\n\n".join(text_list)

        if not plaintext_file_exists and self._file_cache_key:
            storage.save(self._file_cache_key, text.encode("utf-8"))

        return documents

    def load(self) -> Iterator[Document]:
        blob = Blob.from_path(self._file_path)
        yield from self.parse(blob)

    def parse(self, blob: Blob) -> Iterator[Document]:
        import pypdfium2  # type: ignore

        with blob.as_bytes_io() as file_path:
            pdf_reader = pypdfium2.PdfDocument(file_path, autoclose=True)
            try:
                for page_number, page in enumerate(pdf_reader):
                    text_page = page.get_textpage()
                    content = text_page.get_text_bounded()  # explicit -> no UserWarning
                    text_page.close()
                    page.close()
                    metadata = {"source": blob.source, "page": page_number}
                    yield Document(page_content=content, metadata=metadata)
            finally:
                pdf_reader.close()
