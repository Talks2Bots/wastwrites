@echo off
echo Watching for GitHub changes...
:loop
git fetch origin
git status -uno | findstr "behind" >nul
if %errorlevel% == 0 (
    echo Changes detected! Pulling...
    git pull origin master
    echo Pull complete!
)
timeout /t 7200 /nobreak >nul
goto loop
