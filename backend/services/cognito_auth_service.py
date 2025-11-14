"""AWS Cognito を使用した認証サービスの実装"""
import boto3
from typing import Dict, Any
from botocore.exceptions import ClientError

from backend.services.auth_service import AuthService
from backend.exceptions import AuthenticationError
from backend.config.settings import settings


class CognitoAuthService(AuthService):
    """AWS Cognito を使用した認証サービス"""

    def __init__(self):
        """CognitoAuthService を初期化"""
        self.region = settings.cognito_region or settings.aws_region
        self.user_pool_id = settings.cognito_user_pool_id
        self.client_id = settings.cognito_client_id

        # boto3 クライアントを作成
        session_kwargs = {"region_name": self.region}
        if settings.aws_access_key_id and settings.aws_secret_access_key:
            session_kwargs["aws_access_key_id"] = settings.aws_access_key_id
            session_kwargs["aws_secret_access_key"] = settings.aws_secret_access_key

        self.client = boto3.client("cognito-idp", **session_kwargs)

    def authenticate(self, username: str, password: str) -> Dict[str, Any]:
        """
        ユーザーを認証する

        Args:
            username: ユーザー名
            password: パスワード

        Returns:
            認証トークンを含む辞書
            {
                "access_token": str,
                "id_token": str,
                "refresh_token": str,
                "token_type": str,
                "expires_in": int
            }

        Raises:
            AuthenticationError: 認証に失敗した場合
        """
        try:
            response = self.client.initiate_auth(
                ClientId=self.client_id,
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": username,
                    "PASSWORD": password,
                },
            )

            auth_result = response.get("AuthenticationResult")
            if not auth_result:
                raise AuthenticationError("認証に失敗しました")

            return {
                "access_token": auth_result.get("AccessToken"),
                "id_token": auth_result.get("IdToken"),
                "refresh_token": auth_result.get("RefreshToken"),
                "token_type": auth_result.get("TokenType", "Bearer"),
                "expires_in": auth_result.get("ExpiresIn", 3600),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]

            if error_code == "NotAuthorizedException":
                raise AuthenticationError("ユーザー名またはパスワードが正しくありません")
            elif error_code == "UserNotFoundException":
                raise AuthenticationError("ユーザーが見つかりません")
            elif error_code == "UserNotConfirmedException":
                raise AuthenticationError("ユーザーが確認されていません")
            elif error_code == "TooManyRequestsException":
                raise AuthenticationError("リクエストが多すぎます。しばらくしてから再試行してください")
            else:
                raise AuthenticationError(f"認証エラー: {error_message}")

        except Exception as e:
            raise AuthenticationError(f"予期しないエラーが発生しました: {str(e)}")

    def validate_token(self, token: str) -> Dict[str, Any]:
        """
        アクセストークンを検証する

        Args:
            token: 検証するアクセストークン

        Returns:
            トークンから抽出したユーザー情報を含む辞書
            {
                "username": str,
                "sub": str,
                "email": str (optional),
                ...
            }

        Raises:
            AuthenticationError: トークンが無効または期限切れの場合
        """
        try:
            response = self.client.get_user(AccessToken=token)

            # ユーザー属性を辞書に変換
            user_attributes = {}
            for attr in response.get("UserAttributes", []):
                user_attributes[attr["Name"]] = attr["Value"]

            return {
                "username": response.get("Username"),
                "sub": user_attributes.get("sub"),
                "email": user_attributes.get("email"),
                "email_verified": user_attributes.get("email_verified") == "true",
                "name": user_attributes.get("name"),
                "attributes": user_attributes,
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]

            if error_code == "NotAuthorizedException":
                raise AuthenticationError("トークンが無効または期限切れです")
            elif error_code == "UserNotFoundException":
                raise AuthenticationError("ユーザーが見つかりません")
            else:
                raise AuthenticationError(f"トークン検証エラー: {error_message}")

        except Exception as e:
            raise AuthenticationError(f"予期しないエラーが発生しました: {str(e)}")

    def forgot_password(self, username: str) -> Dict[str, str]:
        """
        パスワードリセットコードを送信する

        Args:
            username: ユーザー名

        Returns:
            送信結果を含む辞書
            {
                "message": str,
                "code_delivery_details": dict
            }

        Raises:
            AuthenticationError: リクエストに失敗した場合
        """
        try:
            response = self.client.forgot_password(
                ClientId=self.client_id,
                Username=username,
            )

            delivery_details = response.get("CodeDeliveryDetails", {})
            
            return {
                "message": "パスワードリセットコードを送信しました",
                "destination": delivery_details.get("Destination", ""),
                "delivery_medium": delivery_details.get("DeliveryMedium", "EMAIL"),
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]

            if error_code == "UserNotFoundException":
                raise AuthenticationError("ユーザーが見つかりません")
            elif error_code == "InvalidParameterException":
                raise AuthenticationError("無効なパラメータです")
            elif error_code == "LimitExceededException":
                raise AuthenticationError("試行回数の上限に達しました。しばらくしてから再試行してください")
            elif error_code == "TooManyRequestsException":
                raise AuthenticationError("リクエストが多すぎます。しばらくしてから再試行してください")
            else:
                raise AuthenticationError(f"パスワードリセットエラー: {error_message}")

        except Exception as e:
            raise AuthenticationError(f"予期しないエラーが発生しました: {str(e)}")

    def confirm_forgot_password(self, username: str, confirmation_code: str, new_password: str) -> Dict[str, str]:
        """
        パスワードリセットを確認して新しいパスワードを設定する

        Args:
            username: ユーザー名
            confirmation_code: 確認コード
            new_password: 新しいパスワード

        Returns:
            成功メッセージを含む辞書
            {
                "message": str
            }

        Raises:
            AuthenticationError: リクエストに失敗した場合
        """
        try:
            self.client.confirm_forgot_password(
                ClientId=self.client_id,
                Username=username,
                ConfirmationCode=confirmation_code,
                Password=new_password,
            )

            return {
                "message": "パスワードが正常にリセットされました"
            }

        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            error_message = e.response["Error"]["Message"]

            if error_code == "CodeMismatchException":
                raise AuthenticationError("確認コードが正しくありません")
            elif error_code == "ExpiredCodeException":
                raise AuthenticationError("確認コードの有効期限が切れています")
            elif error_code == "InvalidPasswordException":
                raise AuthenticationError("パスワードがポリシーに準拠していません")
            elif error_code == "UserNotFoundException":
                raise AuthenticationError("ユーザーが見つかりません")
            elif error_code == "TooManyFailedAttemptsException":
                raise AuthenticationError("試行回数が多すぎます。しばらくしてから再試行してください")
            else:
                raise AuthenticationError(f"パスワード確認エラー: {error_message}")

        except Exception as e:
            raise AuthenticationError(f"予期しないエラーが発生しました: {str(e)}")
