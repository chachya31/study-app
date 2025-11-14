"""認証コントローラー"""
from fastapi import APIRouter, Depends, HTTPException, status, Header

from backend.services.auth_service import AuthService
from backend.services.auth_middleware import get_auth_service
from backend.exceptions import AuthenticationError
from backend.schemas.auth_schemas import (
    LoginRequest,
    LoginResponse,
    UserInfoResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ConfirmForgotPasswordRequest,
    ConfirmForgotPasswordResponse
)


router = APIRouter(prefix="/api/auth", tags=["authentication"])


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


@router.get("/user", response_model=UserInfoResponse, status_code=status.HTTP_200_OK)
async def get_user_info(
    authorization: str = Header(...),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    ユーザー情報取得エンドポイント

    Args:
        authorization: 認証ヘッダー（Bearer トークン）
        auth_service: 認証サービス

    Returns:
        UserInfoResponse: ユーザー情報

    Raises:
        HTTPException: トークンが無効な場合
    """
    try:
        # Bearer トークンを抽出
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効な認証ヘッダー形式です"
            )
        
        token = authorization.replace("Bearer ", "")
        user_info = auth_service.validate_token(token)
        
        return UserInfoResponse(
            username=user_info.get("username", ""),
            name=user_info.get("name", ""),
            sub=user_info.get("sub", ""),
            email=user_info.get("email"),
            email_verified=user_info.get("email_verified")
        )
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ユーザー情報の取得中にエラーが発生しました"
        )


@router.post("/forgot-password", response_model=ForgotPasswordResponse, status_code=status.HTTP_200_OK)
async def forgot_password(
    request: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    パスワード忘れエンドポイント
    パスワードリセットコードをユーザーのメールアドレスに送信

    Args:
        request: パスワード忘れリクエスト
        auth_service: 認証サービス

    Returns:
        ForgotPasswordResponse: 送信結果

    Raises:
        HTTPException: リクエストに失敗した場合
    """
    try:
        result = auth_service.forgot_password(request.username)
        return ForgotPasswordResponse(**result)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="パスワードリセットコードの送信中にエラーが発生しました"
        )


@router.post("/confirm-forgot-password", response_model=ConfirmForgotPasswordResponse, status_code=status.HTTP_200_OK)
async def confirm_forgot_password(
    request: ConfirmForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    パスワードリセット確認エンドポイント
    確認コードを使用して新しいパスワードを設定

    Args:
        request: パスワードリセット確認リクエスト
        auth_service: 認証サービス

    Returns:
        ConfirmForgotPasswordResponse: 成功メッセージ

    Raises:
        HTTPException: リクエストに失敗した場合
    """
    try:
        result = auth_service.confirm_forgot_password(
            request.username,
            request.confirmation_code,
            request.new_password
        )
        return ConfirmForgotPasswordResponse(**result)
    except AuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="パスワードリセットの確認中にエラーが発生しました"
        )
