# Film Actor Management API - バックエンド

Film と Actor の管理システムのバックエンド API です。FastAPI とクリーンアーキテクチャで構築されています。

## 技術スタック

- **Python**: 3.11+
- **Web Framework**: FastAPI
- **認証**: AWS Cognito
- **データベース**: DynamoDB または MySQL（設定で切り替え可能）
- **ORM**: SQLAlchemy（MySQL 使用時）
- **AWS SDK**: boto3

## プロジェクト構造

```
backend/
├── config/              # 設定管理
├── controllers/         # API エンドポイント（FastAPI ルーター）
├── entities/           # ドメインモデル
├── exceptions/         # カスタム例外
├── repositories/       # データアクセス層
├── scripts/           # データベース初期化スクリプト
├── services/          # 外部サービス（認証など）
├── use_cases/         # ビジネスロジック
├── main.py            # FastAPI アプリケーション
├── run.py             # 起動スクリプト
├── start.bat          # Windows 起動スクリプト
├── start.sh           # Unix/Linux/Mac 起動スクリプト
└── requirements.txt   # Python 依存関係
```

## セットアップ

### 1. 依存関係のインストール

```bash
# 仮想環境を作成（推奨）
python -m venv venv

# 仮想環境をアクティベート
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# 依存関係をインストール
pip install -r requirements.txt
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、必要な値を設定します：

```bash
# Windows:
copy .env.example .env
# Unix/Linux/Mac:
cp .env.example .env
```

`.env` ファイルを編集して、以下の設定を行います：

#### 必須設定

```env
# データベースタイプを選択
DATABASE_TYPE=dynamodb  # または mysql

# AWS 認証情報
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# AWS Cognito 設定
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
```

#### DynamoDB を使用する場合

```env
DATABASE_TYPE=dynamodb
DYNAMODB_FILMS_TABLE=Films
DYNAMODB_ACTORS_TABLE=Actors
```

ローカル開発で DynamoDB Local を使用する場合：

```env
DYNAMODB_ENDPOINT_URL=http://localhost:8000
```

#### MySQL を使用する場合

```env
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=film_actor_db
MYSQL_USER=root
MYSQL_PASSWORD=password
```

### 3. データベースの初期化

#### DynamoDB の場合

```bash
python scripts/create_dynamodb_tables.py
```

#### MySQL の場合

```bash
# SQL スクリプトを実行
python scripts/init_mysql_db.py

# または直接 SQL を実行
mysql -u root -p < scripts/create_mysql_tables.sql
```

## アプリケーションの起動

### 方法 1: 起動スクリプトを使用（推奨）

#### Windows:
```bash
start.bat
```

#### Unix/Linux/Mac:
```bash
chmod +x start.sh
./start.sh
```

### 方法 2: Python スクリプトを直接実行

```bash
python run.py
```

### 方法 3: main.py を直接実行

```bash
python -m backend.main
```

### 方法 4: uvicorn を直接使用

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

## API ドキュメント

アプリケーション起動後、以下の URL でインタラクティブな API ドキュメントにアクセスできます：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API エンドポイント

### 認証

- `POST /api/auth/login` - ユーザー認証

### Film 管理

- `GET /api/films` - 全映画を取得
- `POST /api/films` - 映画を作成
- `GET /api/films/{film_id}` - 映画を取得
- `PUT /api/films/{film_id}` - 映画を更新
- `DELETE /api/films/{film_id}` - 映画を削除（論理削除）

### Actor 管理

- `GET /api/actors` - 全アクターを取得
- `POST /api/actors` - アクターを作成
- `GET /api/actors/{actor_id}` - アクターを取得
- `PUT /api/actors/{actor_id}` - アクターを更新
- `DELETE /api/actors/{actor_id}` - アクターを削除（論理削除）

### ヘルスチェック

- `GET /` - API 基本情報
- `GET /health` - ヘルスチェック

## 認証

すべての API エンドポイント（`/api/auth/login` を除く）は認証が必要です。

リクエストヘッダーに以下を含める必要があります：

```
Authorization: Bearer <access_token>
```

## 開発

### コードスタイル

このプロジェクトはクリーンアーキテクチャの原則に従っています：

1. **Entities（エンティティ層）**: ドメインモデル
2. **Use Cases（ユースケース層）**: ビジネスロジック
3. **Interface Adapters（インターフェースアダプター層）**: コントローラーとリポジトリ
4. **Frameworks & Drivers（フレームワーク層）**: FastAPI、AWS、データベース

### テストの実行

```bash
pytest
```

特定のテストを実行：

```bash
pytest tests/test_film_use_cases.py
```

カバレッジ付きで実行：

```bash
pytest --cov=backend --cov-report=html
```

## トラブルシューティング

### 依存関係のエラー

```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### AWS 認証情報のエラー

- AWS CLI が設定されているか確認
- `.env` ファイルの `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` が正しいか確認

### データベース接続エラー

#### DynamoDB:
- AWS 認証情報が正しいか確認
- テーブルが作成されているか確認
- ローカル開発の場合、DynamoDB Local が起動しているか確認

#### MySQL:
- MySQL サーバーが起動しているか確認
- 接続情報（ホスト、ポート、ユーザー名、パスワード）が正しいか確認
- データベースが作成されているか確認

## 環境変数リファレンス

| 変数名 | 説明 | デフォルト値 | 必須 |
|--------|------|-------------|------|
| `DATABASE_TYPE` | データベースタイプ（dynamodb/mysql） | dynamodb | はい |
| `AWS_REGION` | AWS リージョン | ap-northeast-1 | はい |
| `AWS_ACCESS_KEY_ID` | AWS アクセスキー ID | - | はい |
| `AWS_SECRET_ACCESS_KEY` | AWS シークレットアクセスキー | - | はい |
| `COGNITO_USER_POOL_ID` | Cognito ユーザープール ID | - | はい |
| `COGNITO_CLIENT_ID` | Cognito クライアント ID | - | はい |
| `COGNITO_REGION` | Cognito リージョン | AWS_REGION と同じ | いいえ |
| `DYNAMODB_FILMS_TABLE` | DynamoDB Films テーブル名 | Films | いいえ |
| `DYNAMODB_ACTORS_TABLE` | DynamoDB Actors テーブル名 | Actors | いいえ |
| `DYNAMODB_ENDPOINT_URL` | DynamoDB エンドポイント URL | - | いいえ |
| `MYSQL_HOST` | MySQL ホスト | - | MySQL 使用時 |
| `MYSQL_PORT` | MySQL ポート | 3306 | いいえ |
| `MYSQL_DATABASE` | MySQL データベース名 | - | MySQL 使用時 |
| `MYSQL_USER` | MySQL ユーザー名 | - | MySQL 使用時 |
| `MYSQL_PASSWORD` | MySQL パスワード | - | MySQL 使用時 |
| `CORS_ORIGINS` | CORS 許可オリジン（カンマ区切り） | http://localhost:3000,http://localhost:5173 | いいえ |
| `APP_NAME` | アプリケーション名 | Film Actor Management API | いいえ |
| `DEBUG` | デバッグモード | false | いいえ |
| `HOST` | サーバーホスト | 0.0.0.0 | いいえ |
| `PORT` | サーバーポート | 8000 | いいえ |

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
