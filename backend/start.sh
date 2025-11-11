#!/bin/bash
# Unix/Linux/Mac シェルスクリプト - FastAPI アプリケーション起動

echo "Starting Film Actor Management API..."
echo ""

# 仮想環境が存在する場合はアクティベート
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# 環境変数ファイルが存在するか確認
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Using default settings."
    echo "Please copy .env.example to .env and configure it."
    echo ""
fi

# アプリケーションを起動
python run.py
