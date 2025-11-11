@echo off
REM Windows バッチスクリプト - FastAPI アプリケーション起動

echo Starting Film Actor Management API...
echo.

REM 仮想環境が存在する場合はアクティベート
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM 環境変数ファイルが存在するか確認
if not exist .env (
    echo Warning: .env file not found. Using default settings.
    echo Please copy .env.example to .env and configure it.
    echo.
)

REM アプリケーションを起動
python run.py
