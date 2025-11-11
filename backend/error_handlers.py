"""グローバル例外ハンドラー"""
import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from backend.exceptions import (
    AuthenticationError,
    ValidationError,
    NotFoundError,
    DatabaseError,
    ErrorResponse
)

# ロガーの設定
logger = logging.getLogger(__name__)


async def authentication_error_handler(
    request: Request,
    exc: AuthenticationError
) -> JSONResponse:
    """認証エラーハンドラー"""
    logger.error(f"Authentication error: {str(exc)}")
    
    error_response = ErrorResponse(
        error_code="AUTH_ERROR",
        message=str(exc) or "認証に失敗しました",
        details=None
    )
    
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content=error_response.model_dump()
    )


async def validation_error_handler(
    request: Request,
    exc: ValidationError
) -> JSONResponse:
    """検証エラーハンドラー"""
    logger.warning(f"Validation error: {str(exc)}")
    
    error_response = ErrorResponse(
        error_code="VALIDATION_ERROR",
        message=str(exc) or "入力データの検証に失敗しました",
        details=None
    )
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=error_response.model_dump()
    )


async def not_found_error_handler(
    request: Request,
    exc: NotFoundError
) -> JSONResponse:
    """リソースが見つからないエラーハンドラー"""
    logger.info(f"Resource not found: {str(exc)}")
    
    error_response = ErrorResponse(
        error_code="NOT_FOUND",
        message=str(exc) or "リソースが見つかりません",
        details=None
    )
    
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=error_response.model_dump()
    )


async def database_error_handler(
    request: Request,
    exc: DatabaseError
) -> JSONResponse:
    """データベースエラーハンドラー"""
    logger.error(f"Database error: {str(exc)}", exc_info=True)
    
    error_response = ErrorResponse(
        error_code="DATABASE_ERROR",
        message="データベース操作中にエラーが発生しました",
        details={"original_error": str(exc)}
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.model_dump()
    )


async def general_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    """一般的な例外ハンドラー"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    error_response = ErrorResponse(
        error_code="INTERNAL_SERVER_ERROR",
        message="予期しないエラーが発生しました",
        details=None
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.model_dump()
    )


def register_exception_handlers(app):
    """
    FastAPI アプリケーションに例外ハンドラーを登録する
    
    Args:
        app: FastAPI アプリケーションインスタンス
    """
    app.add_exception_handler(AuthenticationError, authentication_error_handler)
    app.add_exception_handler(ValidationError, validation_error_handler)
    app.add_exception_handler(NotFoundError, not_found_error_handler)
    app.add_exception_handler(DatabaseError, database_error_handler)
    app.add_exception_handler(Exception, general_exception_handler)
