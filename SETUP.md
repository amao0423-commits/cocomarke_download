# セットアップ手順

このプロジェクトを動かすには、以下の手順を実行してください。

## 1. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成してください：

### 方法1: コピーして編集

```bash
# .env.local.example をコピー
copy .env.local.example .env.local
```

その後、`.env.local` ファイルを開いて実際の値を設定してください。

### 方法2: 新規作成

`.env.local` ファイルを新規作成し、以下の内容を記入してください：

```env
ACCOUNT_OPTIMIZATION_API_KEY=your_api_key_here
NEXT_PUBLIC_CONTACT_FORM_URL=https://your-contact-form-url.com
ADMIN_SECRET_KEY=your_strong_secret_key_here
```


## 2. GrowthCore APIキーの設定

`ACCOUNT_OPTIMIZATION_API_KEY` に、GrowthCoreから取得したAPIキーを設定してください。

**重要**: 
- APIキーは絶対に公開しないでください
- Gitにコミットされないよう、`.gitignore` に `.env.local` が含まれています

### ローカル（.env.local）

シェルや環境変数読み込み時に `$` が「変数」として解釈されるため、**バックスラッシュでエスケープ**が必要です。

例：
```env
# 元のAPIキー: $2b$12$s1Qmip2ko2ebH/2eTQeyA...
# ローカルではエスケープ:
ACCOUNT_OPTIMIZATION_API_KEY=\$2b\$12\$s1Qmip2ko2ebH/2eTQeyA...
```

### Vercel の環境変数設定

Vercel ダッシュボードの入力欄には文字列として保存されるだけで、シェル展開は行われません。  
**元のキーをそのまま**（`$2b$12$...` の形で）貼り付けてください。エスケープは不要です。

## 3. お問い合わせフォームURLの設定

`.env.local` の `NEXT_PUBLIC_CONTACT_FORM_URL` に、実際のお問い合わせフォームのURLを設定してください。

例：
```env
NEXT_PUBLIC_CONTACT_FORM_URL=https://forms.google.com/your-form-id
```

## 4. 管理者用秘密キーの設定

`.env.local` の `ADMIN_SECRET_KEY` に、推測されにくい秘密キーを設定してください。このキーは入力されたID一覧を閲覧するために使用します。

例：
```env
ADMIN_SECRET_KEY=my_super_secret_key_12345
```

**重要**:
- この秘密キーは絶対に他人に教えないでください
- 推測されにくい文字列を使用してください（ランダムな英数字の組み合わせを推奨）

## 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

## 6. 管理者用ページへのアクセス（オプション）

入力されたID一覧を確認するには、以下のURLにアクセスしてください：

```
http://localhost:3000/admin/entered-ids
```

秘密キー（`.env.local` の `ADMIN_SECRET_KEY`）を入力すると、一覧が表示されます。

**注意**: このページのURLと秘密キーは絶対に外部の利用者に教えないでください。

## APIレスポンス構造の確認（開発者向け）

GrowthCore API が `posts_per_day` や `most_popular_post_time` などを返すか確認する方法です。

1. **開発サーバー起動後**にブラウザで次のURLを開く（`id` は任意のInstagram ID）：
   ```
   http://localhost:3000/api/debug-response-structure?id=instagram
   ```
   成功時は `ok: true` と `topLevelKeys`・`hasPostsPerDay`・`hasMostPopularPostTime` が表示されます。

2. **または** ターミナルで次を実行（要：有効な API キーが `.env.local` に設定済み）：
   ```bash
   node scripts/check-api-structure.mjs instagram
   ```
   レスポンスの全キーと型が表示されます。

## トラブルシューティング

### 「APIキーが設定されていません」エラー

- `.env.local` ファイルがプロジェクトルートに存在するか確認
- ファイル名が正確に `.env.local` か確認（`.env.local.example` ではない）
- APIキーが正しく設定されているか確認
- 開発サーバーを再起動（Ctrl+C で停止 → `npm run dev` で再起動）

### パッケージインストールエラー

```bash
# node_modules と package-lock.json を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

## 次のステップ

セットアップが完了したら、以下を確認してください：

1. ✅ 診断フォームが表示される
2. ✅ 質問に答えて進める
3. ✅ 診断結果が正しく表示される
4. ✅ お問い合わせフォームへのリンクが機能する

問題がある場合は、README.md のトラブルシューティングセクションを確認してください。
