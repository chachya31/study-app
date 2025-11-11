#!/usr/bin/env python3
"""
アプリケーション起動スクリプト

このスクリプトは FastAPI アプリケーションを起動します。
開発環境と本番環境の両方で使用できます。
"""
import sys
import os

# プロジェクトルートをパスに追加
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn
from backend.config.settings import settings


def main():
    """アプリケーションを起動"""
    # 環境変数から設定を取得（デフォルト値あり）
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = settings.debug
    
    print(f"Starting {settings.app_name}...")
    print(f"Database type: {settings.database_type}")
    print(f"Debug mode: {settings.debug}")
    print(f"Server: http://{host}:{port}")
    print(f"API docs: http://{host}:{port}/docs")
    print(f"Reload: {reload}")
    print("-" * 50)
    
    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info" if not settings.debug else "debug"
    )


if __name__ == "__main__":
    main()
