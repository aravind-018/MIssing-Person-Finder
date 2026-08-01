@echo off
title GodsEye Startup

echo ==========================
echo Starting GodsEye...
echo ==========================

echo.
<<<<<<< HEAD
echo Starting AI Service...
start "AI Service" cmd /k "cd /d ai-services && .venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8000"

timeout /t 5 > nul

echo.
echo Starting Backend...
start "Backend" cmd /k "cd /d server && npm run dev"

timeout /t 3 > nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd /d client && npm run dev"

echo.
echo ==========================
echo GodsEye Started
echo ==========================
pause
=======

echo Starting AI Service...
start "AI Service" cmd /c "cd /d ai-services && .venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8000"

timeout /t 5 > nul

echo Starting Backend...
start "Backend" cmd /c "cd /d server && npm run dev"

timeout /t 3 > nul

echo Starting Frontend...
start "Frontend" cmd /c "cd /d client && npm run dev"

exit
>>>>>>> 2fb43f8 (Electron desktop launcher with automatic startup and splash screen)
