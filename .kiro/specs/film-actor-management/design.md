# 設計ドキュメント

## 概要

Film と Actor の管理システムは、クリーンアーキテクチャの原則に基づいて設計された、マイクロサービス指向の Web アプリケーションです。バックエンドは Python の FastAPI フレームワークを使用し、フロントエンドは React + TypeScript で構築されます。認証は AWS Cognito で処理され、データは DynamoDB または MySQL に保存されます。

### 技術スタック

**バックエンド:**
- Python 3.11+
- FastAPI
- Pydantic（データ検証）
- boto3（AWS SDK - DynamoDB と Cognito）
- SQLAlchemy（MySQL ORM）
- PyMySQL（MySQL ドライバー）
- python-jose（JWT トークン処理）

**フロントエンド:**
- React 18+
- TypeScript
- React Router（ルーティング）
- Axios（HTTP クライアント）
- React Hook Form（フォーム管理）
- TanStack Query（データフェッチング）

**インフラストラクチャ:**
- AWS Cognito（認証）
- AWS DynamoDB（NoSQL データベース）
- MySQL 8.0+（リレーショナルデータベース）

## アーキテクチャ

### バックエンドアーキテクチャ（クリーンアーキテクチャ）

```
┌─────────────────────────────────────────────────────────────┐
│                    Frameworks & Drivers                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   FastAPI    │  │  DynamoDB    │  │    MySQL     │      │
│  │  (Web API)   │  │  (boto3)     │  │ (SQLAlchemy) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│              Interface Adapters (Controllers)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Film     │  │    Actor     │  │     Auth     │      │
│  │  Controller  │  │  Controller  │  │  Controller  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Film     │  │    Actor     │  │     Auth     │      │
│  │  Repository  │  │  Repository  │  │   Service    │      │
│  │  (DynamoDB)  │  │  (DynamoDB)  │  │  (Cognito)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │     Film     │  │    Actor     │                         │
│  │  Repository  │  │  Repository  │                         │
│  │   (MySQL)    │  │   (MySQL)    │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Use Cases (Business Logic)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Create Film  │  │ Create Actor │  │   Authenticate│      │
│  │  Get Films   │  │  Get Actors  │  │     User      │      │
│  │ Update Film  │  │ Update Actor │  │               │      │
│  │ Delete Film  │  │ Delete Actor │  │               │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    Entities (Domain Models)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Film     │  │    Actor     │  │     User     │      │
│  │    Entity    │  │    Entity    │  │    Entity    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### フロントエンドアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                         Components                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Login     │  │   FilmList   │  │  ActorList   │      │
│  │     Page     │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   FilmForm   │  │  ActorForm   │                         │
│  │  (Create/    │  │  (Create/    │                         │
│  │   Edit)      │  │   Edit)      │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Services / Hooks                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │     Film     │  │    Actor     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   useAuth    │  │  useFilms    │  │  useActors   │      │
│  │     Hook     │  │     Hook     │  │     Hook     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                        API Client                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Axios Instance (with Auth)            │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## コンポーネントとインターフェース

### バックエンドコンポーネント

#### 1. エンティティ層（Domain Models）

**Film Entity:**
```python
@dataclass
class Film:
    film_id: str
    title: str
    description: Optional[str]
    image_path: Optional[str]
    release_year: Optional[int]
    rating: Rating
    last_update: datetime
    delete_flag: bool = False
```

**Actor Entity:**
```python
@dataclass
class Actor:
    actor_id: str
    first_name: str
    last_name: str
    last_update: datetime
    delete_flag: bool = False
```

**Rating Enum:**
```python
class Rating(str, Enum):
    G = "G"
    PG = "PG"
    PG_13 = "PG-13"
    R = "R"
    NC_17 = "NC-17"
```

#### 2. ユースケース層（Business Logic）

**Film Use Cases:**
- `CreateFilmUseCase`: 新しい映画を作成
- `GetFilmsUseCase`: 全映画を取得（delete_flag=False）
- `GetFilmByIdUseCase`: ID で映画を取得
- `UpdateFilmUseCase`: 映画情報を更新
- `DeleteFilmUseCase`: 映画を論理削除（delete_flag=True）

**Actor Use Cases:**
- `CreateActorUseCase`: 新しいアクターを作成
- `GetActorsUseCase`: 全アクターを取得（delete_flag=False）
- `GetActorByIdUseCase`: ID でアクターを取得
- `UpdateActorUseCase`: アクター情報を更新
- `DeleteActorUseCase`: アクターを論理削除（delete_flag=True）

**Auth Use Cases:**
- `AuthenticateUserUseCase`: ユーザーを認証し、トークンを返す
- `ValidateTokenUseCase`: アクセストークンを検証

#### 3. インターフェースアダプター層

**Repository Interfaces:**
```python
class FilmRepository(ABC):
    @abstractmethod
    def create(self, film: Film) -> Film:
        pass
    
    @abstractmethod
    def get_all(self) -> List[Film]:
        pass
    
    @abstractmethod
    def get_by_id(self, film_id: str) -> Optional[Film]:
        pass
    
    @abstractmethod
    def update(self, film: Film) -> Film:
        pass
    
    @abstractmethod
    def delete(self, film_id: str) -> bool:
        pass
```

**Repository Implementations:**
- `DynamoDBFilmRepository`: DynamoDB 実装
- `MySQLFilmRepository`: MySQL 実装
- `DynamoDBActor Repository`: DynamoDB 実装
- `MySQLActorRepository`: MySQL 実装

**Auth Service Interface:**
```python
class AuthService(ABC):
    @abstractmethod
    def authenticate(self, username: str, password: str) -> Dict[str, str]:
        pass
    
    @abstractmethod
    def validate_token(self, token: str) -> Dict[str, Any]:
        pass
```

**Auth Service Implementation:**
- `CognitoAuthService`: AWS Cognito 実装

#### 4. フレームワーク層（Web API）

**FastAPI Controllers:**
- `/api/auth/login` (POST): ユーザー認証
- `/api/films` (GET): 全映画を取得
- `/api/films` (POST): 映画を作成
- `/api/films/{film_id}` (GET): 映画を取得
- `/api/films/{film_id}` (PUT): 映画を更新
- `/api/films/{film_id}` (DELETE): 映画を削除
- `/api/actors` (GET): 全アクターを取得
- `/api/actors` (POST): アクターを作成
- `/api/actors/{actor_id}` (GET): アクターを取得
- `/api/actors/{actor_id}` (PUT): アクターを更新
- `/api/actors/{actor_id}` (DELETE): アクターを削除

### フロントエンドコンポーネント

#### Pages
- `LoginPage`: ログインフォーム
- `FilmListPage`: 映画一覧と作成ボタン
- `FilmFormPage`: 映画作成・編集フォーム
- `ActorListPage`: アクター一覧と作成ボタン
- `ActorFormPage`: アクター作成・編集フォーム

#### Services
- `authService`: 認証 API 呼び出し
- `filmService`: Film CRUD API 呼び出し
- `actorService`: Actor CRUD API 呼び出し

#### Custom Hooks
- `useAuth`: 認証状態管理
- `useFilms`: 映画データフェッチングと変更
- `useActors`: アクターデータフェッチングと変更

## データモデル

### DynamoDB テーブル設計

**Films Table:**
- Partition Key: `film_id` (String)
- Attributes:
  - `title` (String)
  - `description` (String)
  - `image_path` (String)
  - `release_year` (Number)
  - `rating` (String)
  - `last_update` (String - ISO 8601)
  - `delete_flag` (Boolean)
- GSI (Global Secondary Index):
  - `delete_flag-index`: delete_flag をキーとして、削除されていない項目を効率的にクエリ

**Actors Table:**
- Partition Key: `actor_id` (String)
- Attributes:
  - `first_name` (String)
  - `last_name` (String)
  - `last_update` (String - ISO 8601)
  - `delete_flag` (Boolean)
- GSI:
  - `delete_flag-index`: delete_flag をキーとして、削除されていない項目を効率的にクエリ

### MySQL テーブル設計

**films テーブル:**
```sql
CREATE TABLE films (
    film_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(500),
    release_year INT,
    rating ENUM('G', 'PG', 'PG-13', 'R', 'NC-17') NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delete_flag BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_delete_flag (delete_flag)
);
```

**actors テーブル:**
```sql
CREATE TABLE actors (
    actor_id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delete_flag BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_delete_flag (delete_flag)
);
```

## エラーハンドリング

### バックエンドエラーレスポンス構造

```python
class ErrorResponse(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
```

### エラータイプ

1. **認証エラー (401)**
   - `AUTH_INVALID_CREDENTIALS`: 無効な認証情報
   - `AUTH_TOKEN_EXPIRED`: トークンの期限切れ
   - `AUTH_TOKEN_INVALID`: 無効なトークン

2. **検証エラー (400)**
   - `VALIDATION_ERROR`: 入力データの検証失敗
   - `INVALID_RATING`: 無効なレーティング値
   - `REQUIRED_FIELD_MISSING`: 必須フィールドの欠落

3. **リソースエラー (404)**
   - `FILM_NOT_FOUND`: 映画が見つからない
   - `ACTOR_NOT_FOUND`: アクターが見つからない

4. **サーバーエラー (500)**
   - `DATABASE_ERROR`: データベース操作エラー
   - `INTERNAL_SERVER_ERROR`: 予期しないサーバーエラー

### フロントエンドエラーハンドリング

- Axios インターセプターでグローバルエラーハンドリング
- 401 エラー時は自動的にログインページにリダイレクト
- エラーメッセージをトースト通知で表示
- フォーム検証エラーはフィールドごとに表示

## テスト戦略

### バックエンドテスト

1. **ユニットテスト**
   - エンティティの検証ロジック
   - ユースケースのビジネスロジック
   - リポジトリの CRUD 操作（モック使用）

2. **統合テスト**
   - API エンドポイントのテスト
   - データベース操作の統合テスト
   - 認証フローのテスト

3. **テストツール**
   - pytest
   - pytest-asyncio
   - moto（AWS サービスのモック）

### フロントエンドテスト

1. **コンポーネントテスト**
   - React Testing Library
   - ユーザーインタラクションのテスト
   - フォーム送信のテスト

2. **統合テスト**
   - API 呼び出しのモック
   - ルーティングのテスト

3. **テストツール**
   - Vitest
   - React Testing Library
   - MSW（Mock Service Worker）

## セキュリティ考慮事項

1. **認証・認可**
   - すべての API エンドポイントは認証が必要（ログインを除く）
   - JWT トークンは HTTP ヘッダーで送信
   - トークンの有効期限を適切に設定

2. **入力検証**
   - すべての入力データを Pydantic でバリデーション
   - SQL インジェクション対策（SQLAlchemy の ORM 使用）
   - XSS 対策（React のデフォルトエスケープ）

3. **CORS 設定**
   - 許可されたオリジンのみアクセス可能
   - 本番環境では厳密な CORS ポリシーを設定

4. **環境変数**
   - 機密情報（AWS 認証情報、データベース接続文字列）は環境変数で管理
   - `.env` ファイルは `.gitignore` に追加

## デプロイメント考慮事項

### バックエンド
- Docker コンテナ化
- 環境変数で DynamoDB/MySQL を切り替え
- AWS Lambda + API Gateway または ECS でのデプロイ

### フロントエンド
- 静的ファイルとしてビルド
- S3 + CloudFront または Vercel でのホスティング
- 環境変数で API エンドポイントを設定

### 設定管理
```python
# backend/config.py
class Settings(BaseSettings):
    database_type: str = "dynamodb"  # or "mysql"
    aws_region: str
    cognito_user_pool_id: str
    cognito_client_id: str
    mysql_host: Optional[str] = None
    mysql_database: Optional[str] = None
    mysql_user: Optional[str] = None
    mysql_password: Optional[str] = None
```

## 依存性注入

バックエンドでは依存性注入を使用して、リポジトリとサービスの実装を切り替えます。

```python
# Dependency injection setup
def get_film_repository() -> FilmRepository:
    if settings.database_type == "dynamodb":
        return DynamoDBFilmRepository()
    elif settings.database_type == "mysql":
        return MySQLFilmRepository()
    else:
        raise ValueError(f"Unsupported database type: {settings.database_type}")

# FastAPI endpoint
@router.post("/films")
async def create_film(
    film_data: FilmCreate,
    repository: FilmRepository = Depends(get_film_repository),
    current_user: User = Depends(get_current_user)
):
    use_case = CreateFilmUseCase(repository)
    return use_case.execute(film_data)
```
