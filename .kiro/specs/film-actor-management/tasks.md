# 実装計画

- [x] 1. バックエンドプロジェクト構造とコア設定のセットアップ



  - バックエンドのディレクトリ構造を作成（entities, use_cases, repositories, controllers, config）
  - 依存関係をインストール（FastAPI, boto3, SQLAlchemy, PyMySQL, python-jose, pydantic-settings）
  - 環境変数設定ファイル（.env.example）を作成
  - 設定管理クラス（Settings）を実装
  - _要件: 7.1, 7.4, 5.3_

- [x] 2. エンティティとドメインモデルの実装





  - [x] 2.1 Rating Enum を定義


    - G, PG, PG-13, R, NC-17 の値を持つ Enum クラスを作成
    - _要件: 2.2, 4.2_

  - [x] 2.2 Film Entity を実装

    - film_id, title, description, image_path, release_year, rating, last_update, delete_flag のフィールドを持つデータクラスを作成
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 2.3 Actor Entity を実装


    - actor_id, first_name, last_name, last_update, delete_flag のフィールドを持つデータクラスを作成
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. リポジトリインターフェースの定義





  - [x] 3.1 FilmRepository 抽象基底クラスを作成


    - create, get_all, get_by_id, update, delete メソッドを定義
    - _要件: 5.4, 7.3_
  - [x] 3.2 ActorRepository 抽象基底クラスを作成


    - create, get_all, get_by_id, update, delete メソッドを定義
    - _要件: 5.4, 7.3_

- [x] 4. DynamoDB リポジトリの実装





  - [x] 4.1 DynamoDBFilmRepository を実装


    - boto3 を使用して Films テーブルに対する CRUD 操作を実装
    - delete_flag-index GSI を使用して削除されていない映画を取得
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.5_
  - [x] 4.2 DynamoDBActorRepository を実装


    - boto3 を使用して Actors テーブルに対する CRUD 操作を実装
    - delete_flag-index GSI を使用して削除されていないアクターを取得
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.5_
  - [x] 4.3 DynamoDB テーブル作成スクリプトを作成


    - Films と Actors テーブルを作成するスクリプト
    - GSI の設定を含む
    - _要件: 5.1_

- [x] 5. MySQL リポジトリの実装




  - [x] 5.1 SQLAlchemy モデルを定義


    - Film と Actor の ORM モデルを作成
    - _要件: 5.2, 5.5_
  - [x] 5.2 MySQLFilmRepository を実装


    - SQLAlchemy を使用して films テーブルに対する CRUD 操作を実装
    - delete_flag でフィルタリング
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5, 5.2, 5.5_
  - [x] 5.3 MySQLActorRepository を実装


    - SQLAlchemy を使用して actors テーブルに対する CRUD 操作を実装
    - delete_flag でフィルタリング
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 5.2, 5.5_
  - [x] 5.4 データベースマイグレーションスクリプトを作成


    - films と actors テーブルを作成する SQL スクリプト
    - _要件: 5.2_

- [x] 6. 認証サービスの実装





  - [x] 6.1 AuthService 抽象基底クラスを作成


    - authenticate と validate_token メソッドを定義
    - _要件: 1.1, 1.4_
  - [x] 6.2 CognitoAuthService を実装


    - boto3 を使用して AWS Cognito と統合
    - ユーザー認証とトークン検証を実装
    - _要件: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [x] 6.3 JWT トークン検証ミドルウェアを実装


    - FastAPI の依存性注入を使用して認証を強制
    - トークンをデコードして現在のユーザーを取得
    - _要件: 1.4, 1.5_

- [x] 7. Film ユースケースの実装





  - [x] 7.1 CreateFilmUseCase を実装


    - 入力データを検証（title が空でない、rating が有効）
    - UUID で film_id を生成
    - last_update を現在時刻に設定
    - リポジトリを使用して Film を作成
    - _要件: 2.1, 4.1, 4.2, 4.4, 4.5, 7.2_
  - [x] 7.2 GetFilmsUseCase を実装


    - リポジトリから delete_flag=False の全映画を取得
    - _要件: 2.2, 7.2_
  - [x] 7.3 GetFilmByIdUseCase を実装


    - リポジトリから指定された film_id の映画を取得
    - 映画が見つからない場合はエラーを返す
    - _要件: 2.3, 7.2_
  - [x] 7.4 UpdateFilmUseCase を実装


    - 入力データを検証
    - last_update を現在時刻に更新
    - リポジトリを使用して Film を更新
    - _要件: 2.4, 4.1, 4.2, 4.4, 4.5, 7.2_
  - [x] 7.5 DeleteFilmUseCase を実装


    - 指定された film_id の delete_flag を true に設定
    - リポジトリを使用して更新
    - _要件: 2.5, 7.2_

- [x] 8. Actor ユースケースの実装





  - [x] 8.1 CreateActorUseCase を実装


    - 入力データを検証（first_name と last_name が空でない）
    - UUID で actor_id を生成
    - last_update を現在時刻に設定
    - リポジトリを使用して Actor を作成
    - _要件: 3.1, 4.3, 4.4, 7.2_
  - [x] 8.2 GetActorsUseCase を実装


    - リポジトリから delete_flag=False の全アクターを取得
    - _要件: 3.2, 7.2_
  - [x] 8.3 GetActorByIdUseCase を実装


    - リポジトリから指定された actor_id のアクターを取得
    - アクターが見つからない場合はエラーを返す
    - _要件: 3.3, 7.2_
  - [x] 8.4 UpdateActorUseCase を実装


    - 入力データを検証
    - last_update を現在時刻に更新
    - リポジトリを使用して Actor を更新
    - _要件: 3.4, 4.3, 4.4, 7.2_
  - [x] 8.5 DeleteActorUseCase を実装


    - 指定された actor_id の delete_flag を true に設定
    - リポジトリを使用して更新
    - _要件: 3.5, 7.2_

- [x] 9. エラーハンドリングの実装





  - [x] 9.1 カスタム例外クラスを定義


    - AuthenticationError, ValidationError, NotFoundError, DatabaseError を作成
    - _要件: 8.5_
  - [x] 9.2 ErrorResponse モデルを作成


    - error_code, message, details フィールドを持つ Pydantic モデル
    - _要件: 8.2_
  - [x] 9.3 グローバル例外ハンドラーを実装


    - FastAPI の例外ハンドラーを使用して各例外タイプを適切な HTTP ステータスコードにマッピング
    - エラーログを記録
    - _要件: 8.1, 8.2, 8.4, 8.5_

- [x] 10. FastAPI コントローラーの実装





  - [x] 10.1 依存性注入の設定


    - get_film_repository と get_actor_repository 関数を実装
    - 環境変数に基づいて DynamoDB または MySQL リポジトリを返す
    - _要件: 5.3, 7.5_
  - [x] 10.2 認証エンドポイントを実装


    - POST /api/auth/login: ユーザー認証
    - _要件: 1.1, 1.2, 1.3, 6.2_
  - [x] 10.3 Film エンドポイントを実装


    - GET /api/films: 全映画を取得
    - POST /api/films: 映画を作成
    - GET /api/films/{film_id}: 映画を取得
    - PUT /api/films/{film_id}: 映画を更新
    - DELETE /api/films/{film_id}: 映画を削除
    - すべてのエンドポイントに認証を適用
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5, 6.2_
  - [x] 10.4 Actor エンドポイントを実装


    - GET /api/actors: 全アクターを取得
    - POST /api/actors: アクターを作成
    - GET /api/actors/{actor_id}: アクターを取得
    - PUT /api/actors/{actor_id}: アクターを更新
    - DELETE /api/actors/{actor_id}: アクターを削除
    - すべてのエンドポイントに認証を適用
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 6.2_
  - [x] 10.5 CORS 設定を追加


    - FastAPI の CORSMiddleware を設定
    - 許可されたオリジンを環境変数で管理
    - _要件: 6.2_

- [x] 11. バックエンドのメインアプリケーションファイルを作成





  - FastAPI アプリケーションインスタンスを作成
  - ルーターを登録
  - ミドルウェアを設定
  - アプリケーション起動スクリプトを作成
  - _要件: 7.4_

- [x] 12. フロントエンドプロジェクト構造のセットアップ





  - Vite + React + TypeScript プロジェクトを作成
  - 依存関係をインストール（react-router-dom, axios, react-hook-form, @tanstack/react-query）
  - ディレクトリ構造を作成（components, pages, services, hooks, types）
  - _要件: 6.1_

- [x] 13. TypeScript 型定義の作成





  - Film, Actor, Rating, User の型を定義
  - API リクエスト・レスポンスの型を定義
  - _要件: 6.1_

- [x] 14. API クライアントの実装





  - [x] 14.1 Axios インスタンスを作成


    - ベース URL を環境変数から取得
    - リクエストインターセプターで認証トークンを追加
    - レスポンスインターセプターでエラーハンドリング
    - _要件: 6.2, 6.3, 6.7, 8.3_
  - [x] 14.2 authService を実装


    - login 関数を実装
    - _要件: 1.1, 6.2_
  - [x] 14.3 filmService を実装


    - getFilms, getFilmById, createFilm, updateFilm, deleteFilm 関数を実装
    - _要件: 2.1, 2.2, 2.3, 2.4, 2.5, 6.6_
  - [x] 14.4 actorService を実装


    - getActors, getActorById, createActor, updateActor, deleteActor 関数を実装
    - _要件: 3.1, 3.2, 3.3, 3.4, 3.5, 6.6_

- [x] 15. 認証機能の実装





  - [x] 15.1 useAuth カスタムフックを実装


    - ログイン、ログアウト、認証状態管理
    - トークンを localStorage に保存
    - _要件: 6.1, 6.2_
  - [x] 15.2 AuthContext を作成


    - 認証状態をアプリケーション全体で共有
    - _要件: 6.1_
  - [x] 15.3 ProtectedRoute コンポーネントを実装


    - 認証されていない場合はログインページにリダイレクト
    - _要件: 6.1_

- [x] 16. ログインページの実装





  - [x] 16.1 LoginPage コンポーネントを作成


    - ユーザー名とパスワードの入力フォーム
    - React Hook Form を使用したフォーム管理
    - _要件: 6.1, 6.2_
  - [x] 16.2 ログイン処理を実装


    - authService を呼び出して認証
    - 成功時はトークンを保存してホームページにリダイレクト
    - エラー時はエラーメッセージを表示
    - _要件: 6.2, 6.7_

- [x] 17. Film 管理ページの実装




  - [x] 17.1 useFilms カスタムフックを実装


    - TanStack Query を使用してデータフェッチング
    - 作成、更新、削除のミューテーション
    - _要件: 6.6_
  - [x] 17.2 FilmListPage コンポーネントを作成


    - 映画一覧をテーブルで表示
    - 各行に編集・削除ボタン
    - 新規作成ボタン
    - _要件: 6.3, 6.5_
  - [x] 17.3 FilmFormPage コンポーネントを作成


    - 映画の作成・編集フォーム
    - React Hook Form を使用したフォーム管理とバリデーション
    - Rating のドロップダウン選択
    - _要件: 6.5, 6.6_
  - [x] 17.4 Film の削除確認ダイアログを実装


    - 削除前に確認ダイアログを表示
    - _要件: 6.5, 6.6_

- [x] 18. Actor 管理ページの実装





  - [x] 18.1 useActors カスタムフックを実装


    - TanStack Query を使用してデータフェッチング
    - 作成、更新、削除のミューテーション
    - _要件: 6.6_
  - [x] 18.2 ActorListPage コンポーネントを作成


    - アクター一覧をテーブルで表示
    - 各行に編集・削除ボタン
    - 新規作成ボタン
    - _要件: 6.4, 6.5_
  - [x] 18.3 ActorFormPage コンポーネントを作成


    - アクターの作成・編集フォーム
    - React Hook Form を使用したフォーム管理とバリデーション
    - _要件: 6.5, 6.6_
  - [x] 18.4 Actor の削除確認ダイアログを実装

    - 削除前に確認ダイアログを表示
    - _要件: 6.5, 6.6_

- [x] 19. ルーティングの設定





  - React Router を使用してルーティングを設定
  - /login: ログインページ
  - /films: 映画一覧ページ
  - /films/new: 映画作成ページ
  - /films/:id/edit: 映画編集ページ
  - /actors: アクター一覧ページ
  - /actors/new: アクター作成ページ
  - /actors/:id/edit: アクター編集ページ
  - _要件: 6.1_

- [x] 20. エラー表示とローディング状態の実装





  - [x] 20.1 エラートースト通知コンポーネントを作成


    - API エラーをユーザーフレンドリーなメッセージで表示
    - _要件: 6.7, 8.3_
  - [x] 20.2 ローディングスピナーコンポーネントを作成


    - データ取得中にローディング表示
    - _要件: 6.6_

- [x] 21. 環境設定とドキュメントの作成





  - [x] 21.1 バックエンドの README.md を作成

    - セットアップ手順、環境変数の説明、実行方法を記載

  - [x] 21.2 フロントエンドの README.md を作成

    - セットアップ手順、環境変数の説明、実行方法を記載
  - [x] 21.3 Docker Compose ファイルを作成

    - バックエンド、フロントエンド、MySQL のコンテナ設定
  - [x] 21.4 .gitignore ファイルを作成



    - Python、Node.js、環境変数ファイルを除外

- [ ] 22. バックエンドのテストコードを作成
  - [ ] 22.1 エンティティのユニットテストを作成
    - Film と Actor のバリデーションテスト
    - _要件: 4.1, 4.2, 4.3_
  - [ ] 22.2 ユースケースのユニットテストを作成
    - Film と Actor のユースケースをモックリポジトリでテスト
    - _要件: 7.2_
  - [ ] 22.3 リポジトリの統合テストを作成
    - DynamoDB と MySQL リポジトリの CRUD 操作をテスト
    - _要件: 5.1, 5.2_
  - [ ] 22.4 API エンドポイントの統合テストを作成
    - FastAPI TestClient を使用してエンドポイントをテスト
    - 認証フローをテスト
    - _要件: 1.1, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 23. フロントエンドのテストコードを作成
  - [ ] 23.1 コンポーネントのユニットテストを作成
    - LoginPage, FilmListPage, ActorListPage のテスト
    - _要件: 6.1, 6.3, 6.4_
  - [ ] 23.2 フォームコンポーネントのテストを作成
    - FilmFormPage と ActorFormPage のバリデーションテスト
    - _要件: 6.5_
  - [ ] 23.3 カスタムフックのテストを作成
    - useAuth, useFilms, useActors のテスト
    - _要件: 6.2, 6.6_
