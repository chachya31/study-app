# Docker Compose セットアップガイド

このドキュメントでは、Docker Compose を使用して Film Actor Management システムを起動する方法を説明します。

## 前提条件

- Docker Engine 20.10+
- Docker Compose 2.0+

### インストール確認

```bash
docker --version
docker-compose --version
```

## クイックスタート

### 1. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、AWS 認証情報を設定します：

```bash
# .env ファイルを作成
cp .env.example .env
```

`.env` ファイルの内容：

```env
# AWS 認証情報
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# AWS Cognito 設定
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_REGION=ap-northeast-1

# デバッグモード（オプション）
DEBUG=true
```

### 2. すべてのサービスを起動

```bash
# バックグラウンドで起動
docker-compose up -d

# ログを表示しながら起動
docker-compose up
```

### 3. アプリケーションにアクセス

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **MySQL**: localhost:3306

## サービス構成

### 1. MySQL データベース

- **コンテナ名**: `film-actor-mysql`
- **ポート**: 3306
- **データベース名**: `film_actor_db`
- **ユーザー名**: `filmuser`
- **パスワード**: `filmpassword`
- **Root パスワード**: `password`

### 2. バックエンド API

- **コンテナ名**: `film-actor-backend`
- **ポート**: 8000
- **データベース**: MySQL（デフォルト）
- **自動リロード**: 有効

### 3. フロントエンド

- **コンテナ名**: `film-actor-frontend`
- **ポート**: 5173
- **API URL**: http://localhost:8000
- **自動リロード**: 有効

### 4. DynamoDB Local（オプション）

- **コンテナ名**: `film-actor-dynamodb`
- **ポート**: 8001
- **プロファイル**: `dynamodb`

## Docker Compose コマンド

### サービスの起動

```bash
# すべてのサービスを起動
docker-compose up -d

# 特定のサービスのみ起動
docker-compose up -d backend frontend mysql

# DynamoDB Local を含めて起動
docker-compose --profile dynamodb up -d
```

### サービスの停止

```bash
# すべてのサービスを停止
docker-compose down

# ボリュームも削除して停止
docker-compose down -v
```

### サービスの再起動

```bash
# すべてのサービスを再起動
docker-compose restart

# 特定のサービスのみ再起動
docker-compose restart backend
```

### ログの確認

```bash
# すべてのサービスのログを表示
docker-compose logs -f

# 特定のサービスのログを表示
docker-compose logs -f backend

# 最新の100行を表示
docker-compose logs --tail=100 backend
```

### サービスの状態確認

```bash
# 実行中のサービスを表示
docker-compose ps

# サービスの詳細情報を表示
docker-compose ps -a
```

### コンテナに入る

```bash
# バックエンドコンテナに入る
docker-compose exec backend bash

# MySQL コンテナに入る
docker-compose exec mysql bash

# MySQL クライアントに接続
docker-compose exec mysql mysql -u filmuser -pfilmpassword film_actor_db
```

## データベース管理

### MySQL データベースの初期化

MySQL コンテナは初回起動時に自動的にテーブルを作成します（`backend/scripts/create_mysql_tables.sql` を使用）。

手動で初期化する場合：

```bash
# MySQL コンテナに入る
docker-compose exec mysql bash

# SQL スクリプトを実行
mysql -u root -ppassword film_actor_db < /docker-entrypoint-initdb.d/init.sql
```

### データベースのバックアップ

```bash
# データベースをバックアップ
docker-compose exec mysql mysqldump -u root -ppassword film_actor_db > backup.sql

# バックアップから復元
docker-compose exec -T mysql mysql -u root -ppassword film_actor_db < backup.sql
```

### データベースのリセット

```bash
# コンテナとボリュームを削除
docker-compose down -v

# 再起動
docker-compose up -d
```

## DynamoDB Local の使用

DynamoDB Local を使用する場合は、プロファイルを指定して起動します：

```bash
# DynamoDB Local を含めて起動
docker-compose --profile dynamodb up -d

# バックエンドの環境変数を変更
# docker-compose.yml の backend サービスで以下を設定：
# DATABASE_TYPE: dynamodb
# DYNAMODB_ENDPOINT_URL: http://dynamodb-local:8000
```

### DynamoDB テーブルの作成

```bash
# バックエンドコンテナに入る
docker-compose exec backend bash

# テーブル作成スクリプトを実行
python scripts/create_dynamodb_tables.py
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
# Windows:
netstat -ano | findstr :8000
# Unix/Linux/Mac:
lsof -i :8000

# docker-compose.yml のポートマッピングを変更
# 例: "8080:8000" に変更
```

### コンテナが起動しない

```bash
# ログを確認
docker-compose logs backend

# コンテナを再ビルド
docker-compose build --no-cache backend
docker-compose up -d backend
```

### データベース接続エラー

```bash
# MySQL の起動を確認
docker-compose ps mysql

# MySQL のヘルスチェックを確認
docker-compose exec mysql mysqladmin ping -h localhost -u root -ppassword

# バックエンドを再起動
docker-compose restart backend
```

### ボリュームの問題

```bash
# すべてのボリュームを削除して再作成
docker-compose down -v
docker volume prune
docker-compose up -d
```

### イメージの再ビルド

```bash
# すべてのイメージを再ビルド
docker-compose build --no-cache

# 特定のサービスのみ再ビルド
docker-compose build --no-cache backend
```

## 開発ワークフロー

### コードの変更

コードを変更すると、自動的にコンテナ内で反映されます（ホットリロード）：

- **バックエンド**: uvicorn の `--reload` オプションで自動リロード
- **フロントエンド**: Vite の開発サーバーで自動リロード

### 依存関係の追加

#### バックエンド

```bash
# requirements.txt を更新
# コンテナを再ビルド
docker-compose build backend
docker-compose up -d backend
```

#### フロントエンド

```bash
# package.json を更新
# コンテナを再ビルド
docker-compose build frontend
docker-compose up -d frontend
```

## プロダクション環境

プロダクション環境では、以下の変更を推奨します：

### docker-compose.prod.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DEBUG: false
    command: uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    # Nginx で静的ファイルを配信
```

### プロダクションビルド

```bash
# プロダクション用にビルド
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# プロダクション環境で起動
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## セキュリティ考慮事項

1. **環境変数**: `.env` ファイルは `.gitignore` に追加し、Git にコミットしない
2. **パスワード**: デフォルトのパスワードを変更する
3. **ポート**: 本番環境では不要なポートを公開しない
4. **ボリューム**: 機密データは適切に保護する

## リソース管理

### リソース制限の設定

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### ディスク使用量の確認

```bash
# Docker のディスク使用量を確認
docker system df

# 未使用のリソースをクリーンアップ
docker system prune -a
```

## 参考リンク

- [Docker Compose ドキュメント](https://docs.docker.com/compose/)
- [Docker ベストプラクティス](https://docs.docker.com/develop/dev-best-practices/)
- [FastAPI Docker デプロイ](https://fastapi.tiangolo.com/deployment/docker/)
