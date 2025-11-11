# 要件ドキュメント

## イントロダクション

Film と Actor の管理システムは、映画とアクターの情報を管理するための Web アプリケーションです。バックエンドは Python（FastAPI）とクリーンアーキテクチャで構築され、フロントエンドは React + TypeScript で実装されます。認証は AWS Cognito を使用し、データストアとして DynamoDB と MySQL の両方をサポートします。

## 用語集

- **Film Management System**: 映画とアクターの情報を管理する Web アプリケーションシステム
- **Backend API**: FastAPI で構築されたバックエンドサービス
- **Frontend Application**: React + TypeScript で構築されたユーザーインターフェース
- **Authentication Service**: AWS Cognito を使用した認証サービス
- **Data Repository**: DynamoDB または MySQL のデータストレージ層
- **Film Entity**: 映画情報を表すデータモデル（film_id, title, description, image_path, release_year, rating, last_update, delete_flag）
- **Actor Entity**: アクター情報を表すデータモデル（actor_id, first_name, last_name, last_update, delete_flag）
- **Rating Enum**: 映画のレーティング（G, PG, PG-13, R, NC-17）
- **CRUD Operations**: Create（作成）、Read（読取）、Update（更新）、Delete（削除）の基本操作

## 要件

### 要件 1: ユーザー認証

**ユーザーストーリー:** システム管理者として、認証されたユーザーのみがシステムにアクセスできるようにしたい。これにより、データのセキュリティを確保できる。

#### 受入基準

1. WHEN ユーザーがログイン情報を送信する時、THE Backend API SHALL AWS Cognito を使用してユーザーを認証する
2. WHEN 認証が成功する時、THE Backend API SHALL アクセストークンをユーザーに返す
3. WHEN 認証が失敗する時、THE Backend API SHALL 適切なエラーメッセージを返す
4. WHEN ユーザーが保護されたエンドポイントにアクセスする時、THE Backend API SHALL 有効なアクセストークンを検証する
5. IF アクセストークンが無効または期限切れの場合、THEN THE Backend API SHALL 401 Unauthorized レスポンスを返す

### 要件 2: Film エンティティの管理

**ユーザーストーリー:** コンテンツ管理者として、映画情報を作成、閲覧、更新、削除できるようにしたい。これにより、映画データベースを効率的に管理できる。

#### 受入基準

1. WHEN 認証されたユーザーが新しい映画情報を送信する時、THE Backend API SHALL Film Entity を Data Repository に作成する
2. WHEN 認証されたユーザーが映画一覧を要求する時、THE Backend API SHALL delete_flag が false の全ての Film Entity を返す
3. WHEN 認証されたユーザーが特定の film_id で映画を要求する時、THE Backend API SHALL 該当する Film Entity を返す
4. WHEN 認証されたユーザーが映画情報の更新を送信する時、THE Backend API SHALL 指定された film_id の Film Entity を更新し last_update を現在時刻に設定する
5. WHEN 認証されたユーザーが映画の削除を要求する時、THE Backend API SHALL 該当する Film Entity の delete_flag を true に設定する

### 要件 3: Actor エンティティの管理

**ユーザーストーリー:** コンテンツ管理者として、アクター情報を作成、閲覧、更新、削除できるようにしたい。これにより、アクターデータベースを効率的に管理できる。

#### 受入基準

1. WHEN 認証されたユーザーが新しいアクター情報を送信する時、THE Backend API SHALL Actor Entity を Data Repository に作成する
2. WHEN 認証されたユーザーがアクター一覧を要求する時、THE Backend API SHALL delete_flag が false の全ての Actor Entity を返す
3. WHEN 認証されたユーザーが特定の actor_id でアクターを要求する時、THE Backend API SHALL 該当する Actor Entity を返す
4. WHEN 認証されたユーザーがアクター情報の更新を送信する時、THE Backend API SHALL 指定された actor_id の Actor Entity を更新し last_update を現在時刻に設定する
5. WHEN 認証されたユーザーがアクターの削除を要求する時、THE Backend API SHALL 該当する Actor Entity の delete_flag を true に設定する

### 要件 4: データ検証

**ユーザーストーリー:** システム管理者として、データの整合性を保証するために入力データを検証したい。これにより、不正なデータがシステムに保存されることを防げる。

#### 受入基準

1. WHEN Film Entity が作成または更新される時、THE Backend API SHALL title フィールドが空でないことを検証する
2. WHEN Film Entity が作成または更新される時、THE Backend API SHALL rating フィールドが Rating Enum の値（G, PG, PG-13, R, NC-17）のいずれかであることを検証する
3. WHEN Actor Entity が作成または更新される時、THE Backend API SHALL first_name と last_name フィールドが空でないことを検証する
4. IF 検証が失敗した場合、THEN THE Backend API SHALL 400 Bad Request レスポンスと詳細なエラーメッセージを返す
5. WHEN release_year が提供される時、THE Backend API SHALL それが有効な年（1800-2100）であることを検証する

### 要件 5: マルチデータベースサポート

**ユーザーストーリー:** システムアーキテクトとして、DynamoDB と MySQL の両方をデータストアとして使用できるようにしたい。これにより、異なるデプロイメント環境に柔軟に対応できる。

#### 受入基準

1. THE Backend API SHALL DynamoDB を使用する Data Repository 実装を提供する
2. THE Backend API SHALL MySQL を使用する Data Repository 実装を提供する
3. WHEN システムが起動する時、THE Backend API SHALL 設定に基づいて適切な Data Repository 実装を選択する
4. THE Backend API SHALL 両方の Data Repository 実装で同じインターフェースを使用する
5. THE Backend API SHALL データベース固有のロジックをリポジトリ層に分離する

### 要件 6: フロントエンドユーザーインターフェース

**ユーザーストーリー:** エンドユーザーとして、直感的な Web インターフェースを通じて映画とアクターを管理したい。これにより、技術的な知識がなくてもシステムを使用できる。

#### 受入基準

1. THE Frontend Application SHALL ユーザーがログイン情報を入力できるログインフォームを提供する
2. WHEN ユーザーがログインする時、THE Frontend Application SHALL Backend API を呼び出して認証を実行する
3. THE Frontend Application SHALL 映画一覧を表示するページを提供する
4. THE Frontend Application SHALL アクター一覧を表示するページを提供する
5. THE Frontend Application SHALL 映画とアクターの作成、編集、削除のためのフォームを提供する
6. WHEN ユーザーが CRUD 操作を実行する時、THE Frontend Application SHALL Backend API を呼び出してデータを永続化する
7. THE Frontend Application SHALL API からのエラーメッセージをユーザーに表示する

### 要件 7: クリーンアーキテクチャの実装

**ユーザーストーリー:** 開発者として、保守性とテスト容易性を確保するためにクリーンアーキテクチャの原則に従いたい。これにより、長期的なコードの品質を維持できる。

#### 受入基準

1. THE Backend API SHALL エンティティ層、ユースケース層、インターフェースアダプター層、フレームワーク層の4層構造を実装する
2. THE Backend API SHALL ビジネスロジックをユースケース層に配置する
3. THE Backend API SHALL データベースアクセスロジックをリポジトリパターンで実装する
4. THE Backend API SHALL 外部依存関係（FastAPI、AWS Cognito、データベース）をフレームワーク層に配置する
5. THE Backend API SHALL 依存性の方向が外側から内側（フレームワーク → インターフェースアダプター → ユースケース → エンティティ）になるようにする

### 要件 8: エラーハンドリング

**ユーザーストーリー:** システム管理者として、エラーが適切に処理され、ユーザーに分かりやすいメッセージが表示されるようにしたい。これにより、問題の診断とユーザーサポートが容易になる。

#### 受入基準

1. WHEN Backend API でエラーが発生する時、THE Backend API SHALL 適切な HTTP ステータスコードを返す
2. WHEN Backend API でエラーが発生する時、THE Backend API SHALL 構造化されたエラーレスポンス（エラーコード、メッセージ、詳細）を返す
3. WHEN Frontend Application が API エラーを受信する時、THE Frontend Application SHALL ユーザーフレンドリーなエラーメッセージを表示する
4. WHEN 予期しないエラーが発生する時、THE Backend API SHALL エラーをログに記録する
5. THE Backend API SHALL 認証エラー、検証エラー、データベースエラー、一般的なサーバーエラーを区別して処理する
