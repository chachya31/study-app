"""認証サービスの抽象基底クラス"""
from abc import ABC, abstractmethod
from typing import Dict, Any


class AuthService(ABC):
    """認証サービスの抽象基底クラス"""

    @abstractmethod
    def authenticate(self, username: str, password: str) -> Dict[str, Any]:
        """
        ユーザーを認証する

        Args:
            username: ユーザー名
            password: パスワード

        Returns:
            認証トークンを含む辞書

        Raises:
            AuthenticationError: 認証に失敗した場合
        """
        pass

    @abstractmethod
    def validate_token(self, token: str) -> Dict[str, Any]:
        """
        アクセストークンを検証する

        Args:
            token: 検証するトークン

        Returns:
            トークンから抽出したユーザー情報を含む辞書

        Raises:
            AuthenticationError: トークンが無効または期限切れの場合
        """
        pass

    @abstractmethod
    def forgot_password(self, username: str) -> Dict[str, str]:
        """
        パスワードリセットコードを送信する

        Args:
            username: ユーザー名

        Returns:
            送信結果を含む辞書

        Raises:
            AuthenticationError: リクエストに失敗した場合
        """
        pass

    @abstractmethod
    def confirm_forgot_password(self, username: str, confirmation_code: str, new_password: str) -> Dict[str, str]:
        """
        パスワードリセットを確認して新しいパスワードを設定する

        Args:
            username: ユーザー名
            confirmation_code: 確認コード
            new_password: 新しいパスワード

        Returns:
            成功メッセージを含む辞書

        Raises:
            AuthenticationError: リクエストに失敗した場合
        """
        pass
