"""認証コントローラー"""
import logging
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
    ConfirmForgotPasswordResponse,
    ConfirmSignUpRequest,
    ConfirmSignUpResponse,
    ResendConfirmationCodeRequest,
    ResendConfirmationCodeResponse
)

logger = logging.getLogger(__name__)


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
    logger.info(f"ログイン試行: username={request.username}")
    try:
        tokens = auth_service.authenticate(request.username, request.password)
        logger.info(f"ログイン成功: username={request.username}")
        return LoginResponse(**tokens)
    except AuthenticationError as e:
        logger.warning(f"認証失敗: username={request.username}, error={str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"認証処理エラー: username={request.username}, error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="認証処理中にエラーが発生しました"
        ) from e


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
    logger.info("ユーザー情報取得リクエスト")
    try:
        # Bearer トークンを抽出
        if not authorization.startswith("Bearer "):
            logger.warning("無効な認証ヘッダー形式")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効な認証ヘッダー形式です"
            )

        token = authorization.replace("Bearer ", "")
        user_info = auth_service.validate_token(token)

        username = user_info.get("username", "")
        logger.info(f"ユーザー情報取得成功: username={username}")

        return UserInfoResponse(
            username=username,
            name=user_info.get("name", ""),
            sub=user_info.get("sub", ""),
            email=user_info.get("email"),
            email_verified=user_info.get("email_verified")
        )
    except AuthenticationError as e:
        logger.warning(f"トークン検証失敗: error={str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"ユーザー情報取得エラー: error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ユーザー情報の取得中にエラーが発生しました"
        ) from e


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
    logger.info(f"パスワードリセット要求: username={request.username}")
    try:
        result = auth_service.forgot_password(request.username)
        logger.info(f"パスワードリセットコード送信成功: username={request.username}")
        return ForgotPasswordResponse(**result)
    except AuthenticationError as e:
        logger.warning(
            f"パスワードリセット失敗: username={request.username}, error={str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"パスワードリセットエラー: username={request.username}, error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="パスワードリセットコードの送信中にエラーが発生しました"
        ) from e


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
    logger.info(f"パスワードリセット確認: username={request.username}")
    try:
        result = auth_service.confirm_forgot_password(
            request.username,
            request.confirmation_code,
            request.new_password
        )
        logger.info(f"パスワードリセット完了: username={request.username}")
        return ConfirmForgotPasswordResponse(**result)
    except AuthenticationError as e:
        logger.warning(
            f"パスワードリセット確認失敗: username={request.username}, error={str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"パスワードリセット確認エラー: username={request.username}, error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="パスワードリセットの確認中にエラーが発生しました"
        ) from e


@router.post("/confirm-signup", response_model=ConfirmSignUpResponse, status_code=status.HTTP_200_OK)
async def confirm_sign_up(
    request: ConfirmSignUpRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    ユーザー確認エンドポイント
    確認コードを使用してユーザー登録を完了する

    Args:
        request: ユーザー確認リクエスト
        auth_service: 認証サービス

    Returns:
        ConfirmSignUpResponse: 成功メッセージ

    Raises:
        HTTPException: リクエストに失敗した場合
    """
    logger.info(f"ユーザー確認: username={request.username}")
    try:
        result = auth_service.confirm_sign_up(
            request.username,
            request.confirmation_code
        )
        logger.info(f"ユーザー確認完了: username={request.username}")
        return ConfirmSignUpResponse(**result)
    except AuthenticationError as e:
        logger.warning(
            f"ユーザー確認失敗: username={request.username}, error={str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"ユーザー確認エラー: username={request.username}, error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ユーザー確認中にエラーが発生しました"
        ) from e


@router.post("/resend-confirmation-code", response_model=ResendConfirmationCodeResponse, status_code=status.HTTP_200_OK)
async def resend_confirmation_code(
    request: ResendConfirmationCodeRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    確認コード再送信エンドポイント
    ユーザー確認コードを再送信する

    Args:
        request: 確認コード再送信リクエスト
        auth_service: 認証サービス

    Returns:
        ResendConfirmationCodeResponse: 送信結果

    Raises:
        HTTPException: リクエストに失敗した場合
    """
    logger.info(f"確認コード再送信要求: username={request.username}")
    try:
        result = auth_service.resend_confirmation_code(request.username)
        logger.info(f"確認コード再送信成功: username={request.username}")
        return ResendConfirmationCodeResponse(**result)
    except AuthenticationError as e:
        logger.warning(
            f"確認コード再送信失敗: username={request.username}, error={str(e)}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.error(
            f"確認コード再送信エラー: username={request.username}, error={str(e)}",
            exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="確認コードの再送信中にエラーが発生しました"
        ) from e
