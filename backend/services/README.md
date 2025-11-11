# 認証サービス

このディレクトリには、認証関連のサービスとミドルウェアが含まれています。

## コンポーネント

### AuthService (抽象基底クラス)
認証サービスのインターフェースを定義します。

- `authenticate(username, password)`: ユーザーを認証し、トークンを返す
- `validate_token(token)`: トークンを検証し、ユーザー情報を返す

### CognitoAuthService
AWS Cognito を使用した認証サービスの実装です。

#### 機能
- ユーザー名とパスワードによる認証
- アクセストークンの検証
- エラーハンドリング（無効な認証情報、トークン期限切れなど）

#### 設定
以下の環境変数が必要です：
- `COGNITO_USER_POOL_ID`: Cognito ユーザープール ID
- `COGNITO_CLIENT_ID`: Cognito クライアント ID
- `COGNITO_REGION` (オプション): Cognito のリージョン（デフォルトは `AWS_REGION`）
- `AWS_ACCESS_KEY_ID` (オプション): AWS アクセスキー
- `AWS_SECRET_ACCESS_KEY` (オプション): AWS シークレットキー

### 認証ミドルウェア
FastAPI の依存性注入を使用した認証ミドルウェアです。

#### 関数
- `get_auth_service()`: 認証サービスのインスタンスを取得
- `get_current_user()`: 現在のユーザー情報を取得（認証必須）
- `get_optional_current_user()`: 現在のユーザー情報を取得（認証オプショナル）

## 使用例

### FastAPI エンドポイントでの使用

```python
from fastapi import APIRouter, Depends
from backend.services import get_current_user

router = APIRouter()

@router.get("/protected")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    return {
        "message": "This is a protected endpoint",
        "user": current_user
    }
```

### 認証エンドポイント

```python
from fastapi import APIRouter, HTTPException
from backend.services import CognitoAuthService
from backend.exceptions import AuthenticationError

router = APIRouter()

@router.post("/login")
async def login(username: str, password: str):
    auth_service = CognitoAuthService()
    try:
        tokens = auth_service.authenticate(username, password)
        return tokens
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=str(e))
```

## エラーハンドリング

認証サービスは以下のエラーを発生させる可能性があります：

- `AuthenticationError`: 認証に失敗した場合
  - 無効な認証情報
  - ユーザーが見つからない
  - ユーザーが確認されていない
  - トークンが無効または期限切れ
  - リクエストが多すぎる

これらのエラーは適切な HTTP ステータスコード（401 Unauthorized）に変換されます。
