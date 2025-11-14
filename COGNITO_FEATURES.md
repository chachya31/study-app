# Cognito機能追加

## 実装した機能

### 1. ユーザー情報表示
- **エンドポイント**: `GET /api/auth/user`
- **機能**: 認証済みユーザーの情報を取得
- **表示情報**:
  - ユーザー名
  - メールアドレス
  - メール確認状態
  - ユーザーID (sub)

### 2. パスワード再発行（パスワードを忘れた場合）
- **エンドポイント**: 
  - `POST /api/auth/forgot-password` - リセットコード送信
  - `POST /api/auth/confirm-forgot-password` - パスワードリセット確認

## バックエンド実装

### 追加ファイル
- `backend/services/cognito_auth_service.py` - 以下のメソッドを追加:
  - `forgot_password()` - パスワードリセットコード送信
  - `confirm_forgot_password()` - パスワードリセット確認

### 更新ファイル
- `backend/services/auth_service.py` - 抽象メソッド追加
- `backend/controllers/auth_controller.py` - 新しいエンドポイント追加:
  - `/api/auth/user` - ユーザー情報取得
  - `/api/auth/forgot-password` - パスワードリセット要求
  - `/api/auth/confirm-forgot-password` - パスワードリセット確認

## フロントエンド実装

### 新規ページ
1. **ProfilePage** (`frontend/src/pages/ProfilePage.tsx`)
   - ユーザー情報を表示
   - ログアウト機能

2. **ForgotPasswordPage** (`frontend/src/pages/ForgotPasswordPage.tsx`)
   - ユーザー名入力
   - リセットコード送信

3. **ResetPasswordPage** (`frontend/src/pages/ResetPasswordPage.tsx`)
   - 確認コード入力
   - 新しいパスワード設定

### 更新ファイル
- `frontend/src/services/authService.ts` - 新しいAPI関数追加:
  - `getUserInfo()` - ユーザー情報取得
  - `forgotPassword()` - パスワードリセット要求
  - `confirmForgotPassword()` - パスワードリセット確認

- `frontend/src/hooks/useAuth.ts` - ユーザー情報の自動取得機能追加

- `frontend/src/types/user.ts` - 新しい型定義追加:
  - `ForgotPasswordRequest`
  - `ForgotPasswordResponse`
  - `ConfirmForgotPasswordRequest`
  - `ConfirmForgotPasswordResponse`

- `frontend/src/App.tsx` - 新しいルート追加:
  - `/profile` - ユーザー情報ページ
  - `/forgot-password` - パスワード忘れページ
  - `/reset-password` - パスワードリセットページ

- `frontend/src/pages/LoginPage.tsx` - パスワード忘れリンク追加

- `frontend/src/components/Header.tsx` - プロフィールページへのナビゲーション追加

## 使用方法

### ユーザー情報表示
1. ログイン後、ヘッダーのユーザーアイコンをクリック
2. プロフィールページでユーザー情報を確認

### パスワード再発行
1. ログインページで「パスワードを忘れた場合」をクリック
2. ユーザー名を入力して「リセットコードを送信」
3. メールで受け取った確認コードを入力
4. 新しいパスワードを設定（8文字以上）
5. 「パスワードをリセット」をクリック
6. ログインページに戻って新しいパスワードでログイン

## セキュリティ機能
- トークンベースの認証
- パスワードポリシーの検証（8文字以上）
- 確認コードの有効期限チェック
- エラーハンドリングとユーザーフレンドリーなメッセージ
