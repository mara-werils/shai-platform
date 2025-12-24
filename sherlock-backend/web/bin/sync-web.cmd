@echo off
setlocal enabledelayedexpansion

:: === Settings ===
set "UPSTREAM_REPO=https://github.com/langgenius/dify.git"
set "LOCAL_DIR=%cd%"
set "TMP_DIR=%cd%\.tmp_upstream"
set "SYNC_FOLDER=web"

echo [INFO] Removing previous directory...
rd /s /q "%TMP_DIR%" 2>nul

echo [INFO] Cloning repository: %UPSTREAM_REPO%
git clone --branch 1.10.0 --depth=1 --filter=blob:none --sparse "%UPSTREAM_REPO%" "%TMP_DIR%"

if errorlevel 1 (
    echo [ERROR] Cloning error. Check the link to the repository.
    exit /b 1
)

cd "%TMP_DIR%"
git sparse-checkout init --cone
git sparse-checkout set %SYNC_FOLDER%

echo [INFO] Syncing  %SYNC_FOLDER% to the workspace...
robocopy "%TMP_DIR%\%SYNC_FOLDER%" "%LOCAL_DIR%" /MIR /XD "%TMP_DIR%" .git .idea node_modules .pnp coverage .next out build .history .yarn storybook-static /XF sync-web.cmd .DS_Store *.pem npm-debug.log* yarn-debug.log* yarn-error.log* .pnpm-debug.log* .pnp.js .pnp.cjs .pnp.loader.mjs .favorites.json .env*.local .vercel *.tsbuildinfo next-env.d.ts package-lock.json *storybook.log mise.toml /NFL /NDL /NJH /NJS /NP

if errorlevel 8 (
    echo [WARNING] Robocopy reported errors. Review output.
)

echo [INFO] Cleaning tmp directory...
rd /s /q "%TMP_DIR%"

echo [SUCCESS] Directory "%SYNC_FOLDER%" is updated successfully from upstream.
exit /b 0
