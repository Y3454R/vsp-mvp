@echo off
REM VSP MVP Development Startup Script for Windows
REM This script starts both backend and frontend in development mode

echo Starting VSP Chatbot Development Environment...

REM Check if .env exists
if not exist .env (
    echo Error: .env file not found!
    echo Please copy env.example to .env and add your OpenAI API key
    pause
    exit /b 1
)

REM Check if frontend\.env.local exists
if not exist frontend\.env.local (
    echo Creating frontend\.env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > frontend\.env.local
)

REM Start Backend
echo Starting Backend (FastAPI)...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)
cd ..
start "VSP Backend" cmd /k python -m uvicorn backend.main:app --reload --port 8000

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend
echo Starting Frontend (Next.js)...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
start "VSP Frontend" cmd /k npm run dev

echo.
echo ==================================
echo VSP Chatbot is starting!
echo ==================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ==================================
echo.
echo Close the terminal windows to stop the services
pause

