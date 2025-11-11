# Film & Actor Management - フロントエンド

Film と Actor の管理システムのフロントエンドアプリケーションです。React + TypeScript + Vite で構築されています。

## 技術スタック

- **React**: 19.2+
- **TypeScript**: 5.9+
- **Vite**: 7.2+ - ビルドツール
- **React Router DOM**: 7.9+ - ルーティング
- **Axios**: 1.13+ - HTTP クライアント
- **React Hook Form**: 7.66+ - フォーム管理とバリデーション
- **TanStack Query**: 5.90+ - データフェッチングとキャッシング

## プロジェクト構造

```
frontend/
├── public/             # 静的ファイル
├── src/
│   ├── components/     # 再利用可能なコンポーネント
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/       # React Context（認証、トーストなど）
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/          # カスタム React フック
│   │   ├── useAuth.ts
│   │   ├── useFilms.ts
│   │   └── useActors.ts
│   ├── pages/          # ページレベルのコンポーネント
│   │   ├── LoginPage.tsx
│   │   ├── FilmListPage.tsx
│   │   ├── FilmFormPage.tsx
│   │   ├── ActorListPage.tsx
│   │   └── ActorFormPage.tsx
│   ├── services/       # API クライアントサービス
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── filmService.ts
│   │   └── actorService.ts
│   ├── types/          # TypeScript 型定義
│   │   └── index.ts
│   ├── App.tsx         # メインアプリケーションコンポーネント
│   └── main.tsx        # エントリーポイント
├── .env.example        # 環境変数のサンプル
├── package.json        # 依存関係とスクリプト
├── tsconfig.json       # TypeScript 設定
└── vite.config.ts      # Vite 設定
```

## セットアップ

### 前提条件

- **Node.js**: 20.19+ または 22.12+
- **npm**: 10+ または **yarn**: 1.22+
- **バックエンド API**: 起動している必要があります（デフォルト: http://localhost:8000）

### 1. 依存関係のインストール

```bash
# npm を使用
npm install

# または yarn を使用
yarn install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーして、必要な値を設定します：

```bash
# Windows:
copy .env.example .env
# Unix/Linux/Mac:
cp .env.example .env
```

`.env` ファイルを編集：

```env
# バックエンド API の URL
VITE_API_BASE_URL=http://localhost:8000
```

## アプリケーションの起動

### 開発モード

```bash
# npm を使用
npm run dev

# または yarn を使用
yarn dev
```

ブラウザで http://localhost:5173 を開きます。

### プロダクションビルド

```bash
# ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 機能

### 認証
- AWS Cognito を使用したユーザー認証
- JWT トークンベースの認証
- 保護されたルート（未認証ユーザーはログインページにリダイレクト）

### Film 管理
- 映画一覧の表示
- 映画の作成
- 映画の編集
- 映画の削除（論理削除）
- フォームバリデーション

### Actor 管理
- アクター一覧の表示
- アクターの作成
- アクターの編集
- アクターの削除（論理削除）
- フォームバリデーション

### UI/UX
- レスポンシブデザイン
- ローディング状態の表示
- エラーメッセージのトースト通知
- フォームバリデーションエラーの表示

## ルーティング

| パス | コンポーネント | 説明 | 認証 |
|------|---------------|------|------|
| `/login` | LoginPage | ログインページ | 不要 |
| `/` | FilmListPage | 映画一覧（ホーム） | 必要 |
| `/films` | FilmListPage | 映画一覧 | 必要 |
| `/films/new` | FilmFormPage | 映画作成 | 必要 |
| `/films/:id/edit` | FilmFormPage | 映画編集 | 必要 |
| `/actors` | ActorListPage | アクター一覧 | 必要 |
| `/actors/new` | ActorFormPage | アクター作成 | 必要 |
| `/actors/:id/edit` | ActorFormPage | アクター編集 | 必要 |

## 開発

### コードスタイル

```bash
# ESLint の実行
npm run lint
```

### 型チェック

```bash
# TypeScript の型チェック
npm run build
```

### ホットリロード

開発サーバーは自動的にファイルの変更を検知してブラウザをリロードします。

## API 統合

### API クライアント

`src/services/api.ts` で Axios インスタンスを設定しています：

- ベース URL: 環境変数 `VITE_API_BASE_URL` から取得
- リクエストインターセプター: 認証トークンを自動的に追加
- レスポンスインターセプター: エラーハンドリング（401 エラー時は自動ログアウト）

### サービス

- **authService**: ログイン API
- **filmService**: Film CRUD API
- **actorService**: Actor CRUD API

### カスタムフック

- **useAuth**: 認証状態管理（ログイン、ログアウト、トークン管理）
- **useFilms**: Film データのフェッチングと変更（TanStack Query 使用）
- **useActors**: Actor データのフェッチングと変更（TanStack Query 使用）

## 状態管理

### Context API

- **AuthContext**: 認証状態をアプリケーション全体で共有
- **ToastContext**: トースト通知の管理

### TanStack Query

- サーバー状態の管理
- 自動キャッシング
- バックグラウンド更新
- 楽観的更新

## エラーハンドリング

### API エラー

- 401 Unauthorized: 自動的にログアウトしてログインページにリダイレクト
- 400 Bad Request: フォームエラーとして表示
- 404 Not Found: エラーメッセージを表示
- 500 Internal Server Error: エラーメッセージを表示

### フォームバリデーション

React Hook Form を使用して、以下のバリデーションを実装：

- 必須フィールドのチェック
- 文字列長の制限
- カスタムバリデーションルール

## トラブルシューティング

### 依存関係のエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

```bash
# TypeScript の型チェック
npx tsc --noEmit

# キャッシュをクリア
rm -rf dist .vite
npm run build
```

### API 接続エラー

1. バックエンド API が起動しているか確認
2. `.env` ファイルの `VITE_API_BASE_URL` が正しいか確認
3. CORS 設定がバックエンドで正しく設定されているか確認

### 認証エラー

1. AWS Cognito の設定が正しいか確認
2. ユーザーが Cognito に登録されているか確認
3. ブラウザの開発者ツールでトークンが正しく保存されているか確認（localStorage）

## デプロイ

### 静的ホスティング（推奨）

```bash
# ビルド
npm run build

# dist/ ディレクトリを以下のサービスにデプロイ：
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - GitHub Pages
```

### 環境変数の設定

デプロイ先のプラットフォームで環境変数を設定：

```
VITE_API_BASE_URL=https://your-api-domain.com
```

### Docker

```dockerfile
# Dockerfile の例
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 環境変数リファレンス

| 変数名 | 説明 | デフォルト値 | 必須 |
|--------|------|-------------|------|
| `VITE_API_BASE_URL` | バックエンド API のベース URL | http://localhost:8000 | はい |

## パフォーマンス最適化

- コード分割（React Router の lazy loading）
- TanStack Query によるデータキャッシング
- Vite による高速ビルド
- Tree shaking による不要なコードの削除

## ブラウザサポート

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
