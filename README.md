# Film & Actor Management System

Film と Actor の管理システムは、映画とアクターの情報を管理するための Web アプリケーションです。バックエンドは Python（FastAPI）とクリーンアーキテクチャで構築され、フロントエンドは React + TypeScript で実装されています。

## 特徴

- **クリーンアーキテクチャ**: 保守性とテスト容易性を重視した設計
- **AWS Cognito 認証**: セキュアなユーザー認証
- **マルチデータベース対応**: DynamoDB と MySQL の両方をサポート
- **モダンな技術スタック**: FastAPI、React、TypeScript
- **Docker 対応**: 簡単なセットアップとデプロイ

## 技術スタック

### バックエンド
- **Python**: 3.11+
- **FastAPI**: 高速な Web フレームワーク
- **AWS Cognito**: 認証サービス
- **DynamoDB / MySQL**: データストレージ
- **SQLAlchemy**: ORM（MySQL 使用時）
- **boto3**: AWS SDK

### フロントエンド
- **React**: 19.2+
- **TypeScript**: 5.9+
- **Vite**: ビルドツール
- **React Router DOM**: ルーティング
- **Axios**: HTTP クライアント
- **React Hook Form**: フォーム管理
- **TanStack Query**: データフェッチングとキャッシング

## プロジェクト構造

```
.
├── backend/              # バックエンド API
│   ├── config/          # 設定管理
│   ├── controllers/     # API エンドポイント
│   ├── entities/        # ドメインモデル
│   ├── exceptions/      # カスタム例外
│   ├── repositories/    # データアクセス層
│   ├── scripts/         # データベース初期化スクリプト
│   ├── services/        # 外部サービス
│   ├── use_cases/       # ビジネスロジック
│   ├── main.py          # FastAPI アプリケーション
│   └── requirements.txt # Python 依存関係
├── frontend/            # フロントエンド
│   ├── src/
│   │   ├── components/  # 再利用可能なコンポーネント
│   │   ├── contexts/    # React Context
│   │   ├── hooks/       # カスタムフック
│   │   ├── pages/       # ページコンポーネント
│   │   ├── services/    # API クライアント
│   │   └── types/       # TypeScript 型定義
│   └── package.json     # npm 依存関係
├── docker-compose.yml   # Docker Compose 設定
└── README.md           # このファイル
```

## クイックスタート

### 前提条件

- **Docker & Docker Compose**: 最新版
- **Node.js**: 20.19+ または 22.12+（ローカル開発の場合）
- **Python**: 3.11+（ローカル開発の場合）
- **AWS アカウント**: Cognito 設定用

### Docker を使用した起動（推奨）

1. **リポジトリをクローン**

```bash
git clone https://github.com/chachya31/[リポジトリ名].git
cd [リポジトリ名]
```

2. **環境変数を設定**

```bash
# ルートディレクトリに .env ファイルを作成
# または docker-compose.yml の環境変数を直接編集
```

必要な環境変数：
```env
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_REGION=ap-northeast-1
```

3. **Docker Compose で起動**

```bash
# MySQL を使用する場合
docker-compose up -d

# DynamoDB Local を使用する場合
docker-compose --profile dynamodb up -d
```

4. **アプリケーションにアクセス**

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **MySQL**: localhost:3306
- **DynamoDB Local**: localhost:8001（dynamodb プロファイル使用時）

### ローカル開発

#### バックエンド

```bash
cd backend

# 仮想環境を作成
python -m venv venv

# 仮想環境をアクティベート
# Windows:
venv\Scripts\activate
# Unix/Linux/Mac:
source venv/bin/activate

# 依存関係をインストール
pip install -r requirements.txt

# 環境変数を設定
copy .env.example .env  # Windows
cp .env.example .env    # Unix/Linux/Mac

# データベースを初期化
python scripts/create_dynamodb_tables.py  # DynamoDB の場合
python scripts/init_mysql_db.py           # MySQL の場合

# サーバーを起動
python run.py
```

詳細は [backend/README.md](backend/README.md) を参照してください。

#### フロントエンド

```bash
cd frontend

# 依存関係をインストール
npm install

# 環境変数を設定
copy .env.example .env  # Windows
cp .env.example .env    # Unix/Linux/Mac

# 開発サーバーを起動
npm run dev
```

詳細は [frontend/README.md](frontend/README.md) を参照してください。

## 主な機能

### 認証
- AWS Cognito を使用したユーザー認証
- JWT トークンベースの認証
- 保護されたルート

### Film 管理
- 映画一覧の表示
- 映画の作成・編集・削除（論理削除）
- 映画情報（タイトル、説明、画像パス、公開年、レーティング）

### Actor 管理
- アクター一覧の表示
- アクターの作成・編集・削除（論理削除）
- アクター情報（名前、姓）

### データ検証
- フォームバリデーション
- サーバーサイドバリデーション
- エラーメッセージの表示

## API エンドポイント

### 認証
- `POST /api/auth/login` - ユーザー認証

### Film
- `GET /api/films` - 全映画を取得
- `POST /api/films` - 映画を作成
- `GET /api/films/{film_id}` - 映画を取得
- `PUT /api/films/{film_id}` - 映画を更新
- `DELETE /api/films/{film_id}` - 映画を削除

### Actor
- `GET /api/actors` - 全アクターを取得
- `POST /api/actors` - アクターを作成
- `GET /api/actors/{actor_id}` - アクターを取得
- `PUT /api/actors/{actor_id}` - アクターを更新
- `DELETE /api/actors/{actor_id}` - アクターを削除

詳細な API ドキュメントは http://localhost:8000/docs で確認できます。

## データベース設定

### DynamoDB

```env
DATABASE_TYPE=dynamodb
DYNAMODB_FILMS_TABLE=Films
DYNAMODB_ACTORS_TABLE=Actors
```

テーブルの作成：
```bash
cd backend
python scripts/create_dynamodb_tables.py
```

### MySQL

```env
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=film_actor_db
MYSQL_USER=root
MYSQL_PASSWORD=password
```

テーブルの作成：
```bash
cd backend
python scripts/init_mysql_db.py
```

## 開発ガイド

### クリーンアーキテクチャ

このプロジェクトは以下の層で構成されています：

1. **Entities（エンティティ層）**: ドメインモデル
   - `backend/entities/`

2. **Use Cases（ユースケース層）**: ビジネスロジック
   - `backend/use_cases/`

3. **Interface Adapters（インターフェースアダプター層）**
   - コントローラー: `backend/controllers/`
   - リポジトリ: `backend/repositories/`

4. **Frameworks & Drivers（フレームワーク層）**
   - FastAPI、AWS、データベース

### テスト

```bash
# バックエンドのテスト
cd backend
pytest

# カバレッジ付き
pytest --cov=backend --cov-report=html
```

### コードスタイル

```bash
# フロントエンドの Lint
cd frontend
npm run lint

# バックエンドの型チェック
cd backend
mypy .
```

## デプロイ

### Docker を使用したデプロイ

```bash
# イメージをビルド
docker-compose build

# コンテナを起動
docker-compose up -d
```

### AWS へのデプロイ

- **バックエンド**: AWS ECS、Lambda、または EC2
- **フロントエンド**: AWS S3 + CloudFront
- **データベース**: DynamoDB または RDS（MySQL）

## トラブルシューティング

### Docker 関連

```bash
# コンテナのログを確認
docker-compose logs backend
docker-compose logs frontend

# コンテナを再起動
docker-compose restart

# すべてをクリーンアップして再起動
docker-compose down -v
docker-compose up -d
```

### データベース接続エラー

- MySQL: `docker-compose logs mysql` でログを確認
- DynamoDB: AWS 認証情報が正しいか確認

### 認証エラー

- AWS Cognito の設定を確認
- ユーザーが Cognito に登録されているか確認
- 環境変数が正しく設定されているか確認

## 環境変数

### 必須

| 変数名 | 説明 |
|--------|------|
| `DATABASE_TYPE` | データベースタイプ（dynamodb/mysql） |
| `AWS_REGION` | AWS リージョン |
| `AWS_ACCESS_KEY_ID` | AWS アクセスキー ID |
| `AWS_SECRET_ACCESS_KEY` | AWS シークレットアクセスキー |
| `COGNITO_USER_POOL_ID` | Cognito ユーザープール ID |
| `COGNITO_CLIENT_ID` | Cognito クライアント ID |

### オプション

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `MYSQL_HOST` | MySQL ホスト | localhost |
| `MYSQL_PORT` | MySQL ポート | 3306 |
| `MYSQL_DATABASE` | MySQL データベース名 | film_actor_db |
| `CORS_ORIGINS` | CORS 許可オリジン | http://localhost:3000,http://localhost:5173 |
| `VITE_API_BASE_URL` | バックエンド API URL | http://localhost:8000 |

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まず Issue を開いて変更内容を議論してください。

## サポート

問題が発生した場合は、GitHub Issues で報告してください。
