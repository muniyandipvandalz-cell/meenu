@echo off
title Push Meenu Proposal to GitHub
color 0E
echo ========================================================
echo    Pushing Meenu Marriage Proposal to GitHub...
echo ========================================================
echo.

set "PATH=C:\Users\xveno\mingit\cmd;%PATH%"
cd /d "%~dp0"

echo [1/3] Staging any new files...
git add .

echo [2/3] Checking git status...
git status -s

echo [3/3] Pushing to GitHub (origin/main)...
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS! Site is being published via GitHub Actions!
    echo    Your live link: https://erenxt250.github.io/Kunthame/
) else (
    echo    If asked for username and token, enter your GitHub
    echo    username (erenXT250) and your Personal Access Token.
)
echo ========================================================
echo.
pause
