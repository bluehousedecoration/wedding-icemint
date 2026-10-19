@echo off
cd /d "%~dp0"
echo Starting wedding site at http://127.0.0.1:5173/?g=ICE0284
echo (Keep this window open while testing)
npm run dev
pause
