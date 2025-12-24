@echo off
setlocal enabledelayedexpansion

:: === Настройки ===
set "UPSTREAM_REPO=https://github.com/langgenius/dify.git"
set "LOCAL_DIR=%cd%"
set "TMP_DIR=%cd%\.tmp_upstream"
set "SYNC_FOLDER=api"

echo [INFO] Удаление предыдущей временной директории...
rd /s /q "%TMP_DIR%" 2>nul

echo [INFO] Клонирование репозитория: %UPSTREAM_REPO%
git clone --branch 1.10.0 --depth=1 --filter=blob:none --sparse "%UPSTREAM_REPO%" "%TMP_DIR%"

if errorlevel 1 (
    echo [ERROR] Ошибка при клонировании. Проверь ссылку на репозиторий.
    exit /b 1
)

cd "%TMP_DIR%"
git sparse-checkout init --cone
git sparse-checkout set %SYNC_FOLDER%

echo [INFO] Копирование %SYNC_FOLDER% в рабочий проект...
robocopy "%TMP_DIR%\%SYNC_FOLDER%" "%LOCAL_DIR%\%SYNC_FOLDER%" /MIR /XD .idea .venv .vscode storage /XF .env /NFL /NDL /NJH /NJS /NP

cd "%LOCAL_DIR%"

echo [INFO] Очистка временной директории...
rd /s /q "%TMP_DIR%"

echo [SUCCESS] Папка "%SYNC_FOLDER%" обновлена из upstream.
exit /b 0
