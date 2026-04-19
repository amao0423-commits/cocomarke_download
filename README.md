# Instagram運用診断ツール

Next.js + Tailwind CSS + Framer Motionで構築した、GrowthCore APIと連携したInstagram運用診断ツールです。

## 機能

- 📱 **スマホファースト設計**: 1問ずつ表示されるステップフォーム
- 🎨 **美しいアニメーション**: Framer Motionによるスライド演出
- 📊 **アカウント診断**: GrowthCore APIによるインスタグラム分析・アドバイス表示
- 🔒 **IP制限**: 10分に1回の診断制限・1時間80回のアクセス制限（悪用防止）
- 👤 **管理者用ページ**: 入力されたID一覧の確認（秘密キー必要）
- 💬 **お問い合わせ誘導**: 診断後にお問い合わせフォームへ誘導

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、以下の内容を設定してください：  
詳細は `SETUP.md` を参照してください。

```env
# GrowthCore API（アカウント診断）
# ローカル: $ は \$ でエスケープ。Vercel: そのまま貼る（エスケープ不要）。
ACCOUNT_OPTIMIZATION_API_KEY=your_api_key_here

# お問い合わせフォームURL
NEXT_PUBLIC_CONTACT_FORM_URL=https://your-contact-form-url.com

# 管理者用秘密キー（入力ID一覧を見るために必要）
ADMIN_SECRET_KEY=your_strong_secret_key_here
```

#### 環境変数の説明

- **ACCOUNT_OPTIMIZATION_API_KEY**: GrowthCoreから取得したAPIキー（診断API用）
- **NEXT_PUBLIC_CONTACT_FORM_URL**: 診断結果画面の「お問い合わせフォームへ」ボタンのリンク先
- **ADMIN_SECRET_KEY**: 管理者ページ（入力ID一覧）で使用する秘密キー。推測されにくい文字列を設定してください

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルドと本番環境

### プロダクションビルド

```bash
npm run build
npm start
```

### Vercelへのデプロイ

1. [Vercel](https://vercel.com) にサインアップ/ログイン
2. プロジェクトをGitリポジトリにプッシュ
3. Vercelでリポジトリをインポート
4. 環境変数を設定：
   - `ACCOUNT_OPTIMIZATION_API_KEY`
   - `NEXT_PUBLIC_CONTACT_FORM_URL`
   - `ADMIN_SECRET_KEY`
5. デプロイ実行

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **診断API**: GrowthCore API（id-analytics）

## プロジェクト構造

```
.
├── app/
│   ├── api/
│   │   ├── analyze/           # 診断API（GrowthCore連携・IP制限）
│   │   ├── admin/entered-ids/ # 管理者用・入力ID一覧
│   │   └── debug-response-structure/ # APIレスポンス構造確認用
│   ├── admin/entered-ids/     # 管理者用ページ
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── InstagramDiagnostic.tsx
│   └── TotalAnalysisCounter.tsx
├── lib/
│   ├── rateLimiter.ts         # IP制限ロジック
│   ├── saveEnteredId.ts
│   └── feedbackFromMetrics.ts
├── data/                      # 入力ID・IPアクセスログ（自動生成）
├── .env.local.example
├── SETUP.md                   # 詳細セットアップ手順
├── IP制限機能について.md      # IP制限の仕様・テスト方法
└── package.json
```

## IP制限

- **診断間隔**: 同一IPから10分に1回まで診断可能
- **アクセス回数**: 同一IPから1時間に80回まで

詳細は `IP制限機能について.md` を参照してください。

## セキュリティ

### APIキー・秘密キーの保護

- ✅ `ACCOUNT_OPTIMIZATION_API_KEY` と `ADMIN_SECRET_KEY` はサーバーサイドでのみ使用
- ✅ `.env.local` は `.gitignore` に含まれており、Gitにコミットされません
- ✅ クライアント側にAPIキーは露出しません

### データプライバシー

- 入力されたInstagram IDは診断のためGrowthCore APIに送信されます
- 入力IDは管理者用ページ用にローカル（またはサーバー）の `data/entered-ids.json` に保存されます
- IP制限用のアクセス履歴は `data/ip-access-logs.json` に保存され、古いログは自動クリーンアップされます

## トラブルシューティング

### 「APIキーが設定されていません」エラー

- `.env.local` がプロジェクトルートに存在するか確認
- ファイル名が `.env.local` であるか確認（`.env.local.example` ではない）
- 開発サーバーを再起動（Ctrl+C → `npm run dev`）

### ビルドエラーが発生する

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

その他の手順は `SETUP.md` を参照してください。

## ライセンス

MIT

## サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。
