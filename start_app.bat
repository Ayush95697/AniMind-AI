@echo off
echo Starting AniMind...

:: Start Backend
start "AniMind Backend" cmd /k "cd backend && uvicorn main:app --reload"

:: Start Frontend
start "AniMind Frontend" cmd /k "cd frontend && npm run dev"

echo AniMind started!
