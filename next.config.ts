import { createRequire } from "node:module";
import type { NextConfig } from "next";

const require = createRequire(import.meta.url);
const { resolveDistDir } = require("./scripts/resolve-next-dist-dir.cjs") as {
  resolveDistDir: () => string | undefined;
};

/**
 * OneDrive 等では `.next` がロックされやすいので、Windows では既定を `.next-local`（相対）にする。
 * 絶対パスの distDir（例: AppData）は next dev の trace 等でパス誤結合の ENOENT が出るため使わない。
 * `npm run dev` は Turbopack（ファイル更新が webpack より少なく EBUSY が出にくいことがある）。
 * Webpack 開発サーバーが必要なら `npm run dev:webpack`。
 * 上書き: NEXT_DIST_DIR（相対推奨: `.next` / `.next-local`）
 *
 * トラブルシュート:
 * - GET / が 500 かつ `routes-manifest.json` が無い（ENOENT）→ 多くは本番ビルド未実行。`npm run build` を試す。
 *   `ensure-dist-complete.mjs` は `npm run build` 時のみ routes-manifest 欠落・server/chunks 欠落で dist を削除する。
 *   `next dev` では上記が無い／空の状態があり得るため触らない。手動で消したい場合は `npm run dev:clean`。
 * - `readlink` / EINVAL（OneDrive 配下でシンボリックリンク周りが壊れる）→ `.env.local` に
 *   `NEXT_DIST_DIR=.next` を追加するか、プロジェクトを同期フォルダ外へ移す。
 */
const distDir = resolveDistDir();

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  /** Recharts 等の pre-bundled パッケージを Next のトランスパイル対象に含め、チャンク不整合を減らす */
  transpilePackages: ["recharts"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "rakkoserver.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  // OneDrive 等の同期フォルダでは .next 内の Webpack ディスクキャッシュが壊れ、
  // 「Cannot read properties of undefined (reading 'call')」が出ることがある
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    // 同期フォルダ・低速ディスクで静的チャンク取得が遅いと ChunkLoadError になるため待ちを延長
    // オブジェクトの差し替えは path / chunkFilename 等を落とし、server チャンク解決が壊れるため禁止
    if (config.output) {
      config.output.chunkLoadTimeout = 120000;
    }
    return config;
  },
};

export default nextConfig;
