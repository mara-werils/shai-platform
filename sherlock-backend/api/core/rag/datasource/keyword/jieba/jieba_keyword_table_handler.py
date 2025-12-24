import re
from typing import Optional, cast

from models import Dataset


class JiebaKeywordTableHandler:
    def __init__(self):
        import jieba.analyse  # type: ignore

        from core.rag.datasource.keyword.jieba.stopwords import STOPWORDS

        jieba.analyse.default_tfidf.stop_words = STOPWORDS  # type: ignore

    def extract_keywords(self, text: str, max_keywords_per_chunk: Optional[int] = 10,
                         dataset: Optional[Dataset] = None) -> set[str]:
        """Extract keywords with JIEBA tfidf."""
        import jieba.analyse  # type: ignore
        if dataset:
            prompt = f"""
                   Extract the most important keywords from the following text. 
                   Return only the keywords as a comma-separated list, without any additional text or explanation.
                   Maximum number of keywords: {max_keywords_per_chunk}

                   Text: {text}
                   """
            from core.llm_generator.llm_generator import LLMGenerator

            response = LLMGenerator.extract_chunk_keywords(
                tenant_id=dataset.tenant_id,
                query=prompt,
            )

            keywords = [k.strip() for k in response.split(',')] if isinstance(response, str) else response
            print('llm extracted keywords:', keywords)

        else:
            keywords = jieba.analyse.extract_tags(
                sentence=text,
                topK=max_keywords_per_chunk,
            )

        # jieba.analyse.extract_tags returns list[Any] when withFlag is False by default.
        keywords = cast(list[str], keywords)
        final_keywords = set(self._expand_tokens_with_subtokens(set(keywords)))
        return final_keywords


    def _expand_tokens_with_subtokens(self, tokens: set[str]) -> set[str]:
        """Get subtokens from a list of tokens., filtering for stopwords."""
        from core.rag.datasource.keyword.jieba.stopwords import STOPWORDS

        results = set()
        for token in tokens:
            results.add(token)
            sub_tokens = re.findall(r"\w+", token)
            if len(sub_tokens) > 1:
                results.update({w for w in sub_tokens if w not in list(STOPWORDS)})

        return results
