"""認証コントローラー"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.services.auth_service import AuthService
from backend.services.auth_middleware import get_auth_service
from backend.exceptions import AuthenticationError


router = APIRouter(prefix="/api/auth", tags=["authentication"])


class LoginRequest(BaseModel):
    """ログインリクエストモデル"""
    username: str
    password: str


class LoginResponse(BaseModel):
    """ログインレスポンスモデル"""
    access_token: str
    id_token: str
    refresh_token: str
    token_type: str
    expires_in: int


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    request: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    ユーザー認証エンドポイント

    Args:
        request: ログインリクエスト（ユーザー名とパスワード）
        auth_service: 認証サービス

    Returns:
        LoginResponse: 認証トークンを含むレスポンス

    Raises:
        HTTPException: 認証に失敗した場合
    """
    try:
        tokens = auth_service.authenticate(request.username, request.password)
        return LoginResponse(**tokens)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="認証処理中にエラーが発生しました"
        )
