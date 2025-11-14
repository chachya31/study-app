"""認証 API スキーマ"""
from typing import Optional
from pydantic import BaseModel


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

    class Config:
        """Pydantic 設定"""
        from_attributes = True


class UserInfoResponse(BaseModel):
    """ユーザー情報レスポンスモデル"""
    username: str
    name: str
    sub: str
    email: Optional[str] = None
    email_verified: Optional[bool] = None


class ForgotPasswordRequest(BaseModel):
    """パスワード忘れリクエストモデル"""
    username: str


class ForgotPasswordResponse(BaseModel):
    """パスワード忘れレスポンスモデル"""
    message: str
    destination: str
    delivery_medium: str


class ConfirmForgotPasswordRequest(BaseModel):
    """パスワードリセット確認リクエストモデル"""
    username: str
    confirmation_code: str
    new_password: str


class ConfirmForgotPasswordResponse(BaseModel):
    """パスワードリセット確認レスポンスモデル"""
    message: str


class ConfirmSignUpRequest(BaseModel):
    """ユーザー確認リクエストモデル"""
    username: str
    confirmation_code: str


class ConfirmSignUpResponse(BaseModel):
    """ユーザー確認レスポンスモデル"""
    message: str


class ResendConfirmationCodeRequest(BaseModel):
    """確認コード再送信リクエストモデル"""
    username: str


class ResendConfirmationCodeResponse(BaseModel):
    """確認コード再送信レスポンスモデル"""
    message: str
    destination: str
    delivery_medium: str
