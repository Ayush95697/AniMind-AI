@echo off
echo Starting AniMind...

:: Start Backend
start "AniMind Backend" cmd /k "cd backend && uvicorn main:app --reload"

:: Wait a moment for backend to start
ping 127.0.0.1 -n 4 > nul

:: Start Frontend
start "AniMind Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for frontend to start
echo Waiting for services to initialize...
ping 127.0.0.1 -n 6 > nul

:: Open Chrome
echo Opening Chrome...
start chrome "http://localhost:5173"

echo AniMind started!
