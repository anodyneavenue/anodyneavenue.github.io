@echo off
setlocal

set "ROOT=%~dp0"
set "PORT=8000"

cd /d "%ROOT%"

echo Stopping any existing local server on port %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    echo Killing process %%a
    taskkill /PID %%a /T /F >nul 2>nul
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'http\.server\s+%PORT%' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

ping 127.0.0.1 -n 2 >nul

echo.
echo Building site...
call npm run build

if errorlevel 1 (
    echo.
    echo Build failed.
    pause
    exit /b 1
)

if not exist "%ROOT%_site\index.html" (
    echo.
    echo Build finished, but _site\index.html was not found.
    pause
    exit /b 1
)

echo.
echo Starting local server at http://localhost:%PORT%/
echo.

start "" "http://localhost:%PORT%/"

start "anodyne avenue local server" /D "%ROOT%_site" cmd /c "py -m http.server %PORT%"

exit /b 0