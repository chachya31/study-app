"""認証サービスの抽象基底クラス"""
from abc import ABC, abstractmethod
from typing import Dict, Any


class AuthService(ABC):
    """認証サービスの抽象基底クラス"""

    @abstractmethod
    def authenticate(self, username: str, password: str) -> Dict[str, str]:
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
