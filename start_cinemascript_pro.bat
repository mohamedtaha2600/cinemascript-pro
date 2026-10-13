@echo off
@chcp 65001 >nul
title CinemaScript Pro Studio
color 0A

echo =========================================================================
echo                   CinemaScript Pro Studio Server
echo =========================================================================
echo  [+] Operating System: Windows
echo  [+] Launching CinemaScript Pro (Frontend + Express MCP Backend)...
echo  [+] Opening http://localhost:3005 in your browser...
echo =========================================================================
echo.

cd /d "%~dp0"

rem Open the default web browser automatically to the app URL on port 3005
start "" "http://localhost:3005"

npm run dev

pause
