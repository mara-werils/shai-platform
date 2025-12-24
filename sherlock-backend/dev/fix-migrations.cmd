@echo off
setlocal enabledelayedexpansion

:: === Настройки ===
set "VERSIONS_DIR=api\migrations\versions"

:: === Ввод имени миграции ===
set /p MIGRATION_NAME="Enter description of migration (ex: add new field): "

:: === Поиск последней миграции ===
set "LAST_FILE="
for /f "delims=" %%F in ('dir /b /od "%VERSIONS_DIR%\*.py"') do (
    set "LAST_FILE=%%F"
)

if not defined LAST_FILE (
    echo [ERROR] Миграции не найдены в %VERSIONS_DIR%
    exit /b 1
)

for /f "tokens=3 delims= " %%A in ('findstr "revision =" "%VERSIONS_DIR%\%LAST_FILE%"') do (
    set "DOWN_REVISION=%%~A"
    set "DOWN_REVISION=!DOWN_REVISION:'=!"
)

echo [INFO] Последняя миграция: %LAST_FILE% (revision: %DOWN_REVISION%)

:: === Создание новой миграции ===
alembic revision -m "%MIGRATION_NAME%" > nul

if errorlevel 1 (
    echo [ERROR] Ошибка при создании миграции.
    exit /b 1
)

:: === Поиск новой миграции ===
set "NEW_FILE="
for /f "delims=" %%F in ('dir /b /od "%VERSIONS_DIR%\*.py"') do (
    set "NEW_FILE=%%F"
)

if not defined NEW_FILE (
    echo [ERROR] Новая миграция не найдена.
    exit /b 1
)

:: === Обновление down_revision ===
echo [INFO] Обновление down_revision в: %VERSIONS_DIR%\%NEW_FILE%
powershell -Command "(Get-Content %VERSIONS_DIR%\%NEW_FILE%) -replace 'down_revision = .*', 'down_revision = ''%DOWN_REVISION%''' | Set-Content %VERSIONS_DIR%\%NEW_FILE%"

echo [SUCCESS] Миграция успешно создана: %NEW_FILE%
exit /b 0
