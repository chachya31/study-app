# スタイル管理

このディレクトリには、アプリケーション全体で使用される共通スタイルが含まれています。

## ファイル構成

### common.css
共通で使用される基本的なスタイルを定義しています。

- **ボタンスタイル**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-sm`
- **ページレイアウト**: `.page-container`, `.page-header`
- **状態表示**: `.loading`, `.error`, `.empty-state`
- **テーブルスタイル**: `.table-container`, `.data-table`
- **フォームスタイル**: `.form-container`, `.form-group`, `.form-actions`

### components.css
コンポーネント固有のスタイルを定義しています。

- **Header**: ヘッダーコンポーネントのスタイル
- **ConfirmDialog**: 確認ダイアログのスタイル

### pages.css
ページ固有のスタイルを定義しています。

- **FilmListPage / ActorListPage**: 一覧ページのスタイル
- **FilmFormPage / ActorFormPage**: フォームページのスタイル
- **LoginPage**: ログインページのスタイル

## 使用方法

これらのスタイルは `index.css` で自動的にインポートされるため、個別にインポートする必要はありません。

```css
/* index.css */
@import "tailwindcss";
@import "./styles/common.css";
@import "./styles/components.css";
@import "./styles/pages.css";
```

## スタイルの追加

新しいスタイルを追加する場合は、以下のガイドラインに従ってください：

1. **共通スタイル**: 複数のページやコンポーネントで使用される場合は `common.css` に追加
2. **コンポーネント固有**: 特定のコンポーネントでのみ使用される場合は `components.css` に追加
3. **ページ固有**: 特定のページでのみ使用される場合は `pages.css` に追加

## 注意事項

- このプロジェクトは主にTailwind CSSを使用しています
- カスタムCSSは、Tailwindで表現できない特殊なスタイルやアニメーションに限定してください
- 可能な限りTailwindのユーティリティクラスを使用することを推奨します
