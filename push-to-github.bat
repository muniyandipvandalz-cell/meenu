@echo off
title Push Meenu Proposal to GitHub
color 0E
echo ========================================================
echo    Pushing Meenu Marriage Proposal to GitHub...
echo ========================================================
echo.

cd /d "%~dp0"
git push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo    SUCCESS! Site is being published!
) else (
    echo    If it asked to sign in, complete the browser
    echo    prompt and run this file again.
)
echo ========================================================
echo.
pause
