# Backend Scripts

このディレクトリには、バックエンドのセットアップとメンテナンスに使用するスクリプトが含まれています。

## DynamoDB テーブル作成スクリプト

### 概要

`create_dynamodb_tables.py` は、Films と Actors テーブルを DynamoDB に作成するスクリプトです。

### 使用方法

1. 環境変数を設定します（`.env` ファイルまたはシステム環境変数）:

```bash
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_FILMS_TABLE=Films
DYNAMODB_ACTORS_TABLE=Actors
```

2. スクリプトを実行します:

```bash
python backend/scripts/create_dynamodb_tables.py
```

### ローカル開発（DynamoDB Local）

ローカルで DynamoDB Local を使用する場合は、以下の環境変数を追加します:

```bash
DYNAMODB_ENDPOINT_URL=http://localhost:8000
```

### テーブル構造

#### Films テーブル

- **Partition Key**: `film_id` (String)
- **Attributes**:
  - `title` (String)
  - `description` (String)
  - `image_path` (String)
  - `release_year` (Number)
  - `rating` (String)
  - `last_update` (String - ISO 8601)
  - `delete_flag` (Number - 0 or 1)
- **GSI**: `delete_flag-index` - delete_flag をキーとして削除されていない映画を効率的にクエリ

#### Actors テーブル

- **Partition Key**: `actor_id` (String)
- **Attributes**:
  - `first_name` (String)
  - `last_name` (String)
  - `last_update` (String - ISO 8601)
  - `delete_flag` (Number - 0 or 1)
- **GSI**: `delete_flag-index` - delete_flag をキーとして削除されていないアクターを効率的にクエリ

### 注意事項

- スクリプトは既存のテーブルをチェックし、既に存在する場合はスキップします
- プロビジョニングされたスループットは、読み取り/書き込みともに 5 ユニットに設定されています
- 本番環境では、適切なスループット設定を検討してください
