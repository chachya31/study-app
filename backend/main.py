"""FastAPI メインアプリケーション"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config.settings import settings
from backend.controllers import auth_controller, film_controller, actor_controller
from backend.error_handlers import (
    register_exception_handlers
)

# ロギング設定
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """
    FastAPI アプリケーションを作成して設定する

    Returns:
        FastAPI: 設定済みの FastAPI アプリケーションインスタンス
    """
    logger.info(f"Creating FastAPI application: {settings.app_name}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"Database type: {settings.database_type}")
    
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
        description="Film と Actor の管理システム API",
        version="1.0.0"
    )

    # CORS ミドルウェアを設定
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ルーターを登録
    app.include_router(auth_controller.router)
    app.include_router(film_controller.router)
    app.include_router(actor_controller.router)

    # 例外ハンドラーを登録
    register_exception_handlers(app)

    return app


# アプリケーションインスタンスを作成
app = create_app()


@app.get("/")
async def root():
    """
    ルートエンドポイント

    Returns:
        dict: API の基本情報
    """
    return {
        "message": "Film Actor Management API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """
    ヘルスチェックエンドポイント

    Returns:
        dict: ヘルスステータス
    """
    return {
        "status": "healthy",
        "database_type": settings.database_type
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
