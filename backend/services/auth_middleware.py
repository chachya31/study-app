"""認証ミドルウェアと依存性注入"""
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.services.auth_service import AuthService
from backend.services.cognito_auth_service import CognitoAuthService
from backend.exceptions import AuthenticationError


# HTTPBearer スキームを定義
security = HTTPBearer()


def get_auth_service() -> AuthService:
    """
    認証サービスのインスタンスを取得する依存性注入関数

    Returns:
        AuthService: 認証サービスのインスタンス
    """
    return CognitoAuthService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
) -> Dict[str, Any]:
    """
    現在のユーザーを取得する依存性注入関数

    Args:
        credentials: HTTP Authorization ヘッダーから取得した認証情報
        auth_service: 認証サービスのインスタンス

    Returns:
        Dict[str, Any]: 現在のユーザー情報

    Raises:
        HTTPException: 認証に失敗した場合
    """
    token = credentials.credentials

    try:
        user_info = auth_service.validate_token(token)
        return user_info

    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証に失敗しました",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service),
) -> Dict[str, Any] | None:
    """
    現在のユーザーを取得する依存性注入関数（オプショナル）

    認証が失敗してもエラーを発生させず、None を返す

    Args:
        credentials: HTTP Authorization ヘッダーから取得した認証情報
        auth_service: 認証サービスのインスタンス

    Returns:
        Dict[str, Any] | None: 現在のユーザー情報、または None
    """
    if not credentials:
        return None

    token = credentials.credentials

    try:
        user_info = auth_service.validate_token(token)
        return user_info
    except Exception:
        return None
