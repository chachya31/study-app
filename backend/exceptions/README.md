# エラーハンドリング

このモジュールは、アプリケーション全体で使用されるカスタム例外クラスとエラーレスポンスモデルを提供します。

## カスタム例外クラス

### AuthenticationError
認証に関連するエラー（無効な認証情報、トークンの期限切れなど）

### ValidationError
入力データの検証エラー（必須フィールドの欠落、無効な値など）

### NotFoundError
リソースが見つからないエラー（存在しない Film や Actor など）

### DatabaseError
データベース操作中のエラー

## ErrorResponse モデル

エラーレスポンスの標準フォーマット:

```python
{
    "error_code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {  # オプション
        "key": "value"
    }
}
```

## 使用例

```python
from backend.exceptions import NotFoundError, ValidationError

# ユースケースでの使用
def get_film_by_id(film_id: str):
    film = repository.get_by_id(film_id)
    if not film:
        raise NotFoundError(f"Film with id {film_id} not found")
    return film

# バリデーションエラー
def create_film(title: str):
    if not title or title.strip() == "":
        raise ValidationError("Title cannot be empty")
```

## グローバル例外ハンドラー

グローバル例外ハンドラーは `backend/error_handlers.py` に実装されています。
FastAPI アプリケーションの作成時に登録する必要があります:

```python
from fastapi import FastAPI
from backend.error_handlers import register_exception_handlers

app = FastAPI()
register_exception_handlers(app)
```

これにより、すべてのカスタム例外が適切な HTTP ステータスコードとエラーレスポンスに自動的に変換されます。
