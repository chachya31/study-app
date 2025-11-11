"""カスタム例外クラスとエラーレスポンスモデル"""
from typing import Any, Dict, Optional
from pydantic import BaseModel


class AuthenticationError(Exception):
    """認証エラー"""
    pass


class ValidationError(Exception):
    """検証エラー"""
    pass


class NotFoundError(Exception):
    """リソースが見つからないエラー"""
    pass


class DatabaseError(Exception):
    """データベースエラー"""
    pass


class ErrorResponse(BaseModel):
    """エラーレスポンスモデル"""
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
