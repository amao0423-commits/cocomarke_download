/**
 * resolve-next-dist-dir.cjs と同じ dist 解決
 *
 * routes-manifest.json は next build の成果物。next dev だけでは無いことが多く、
 * それを「不整合」とみなして毎回 dist を消すと開発が成立しない。
 * そのチェックは npm run build のとき（npm_lifecycle_event === "build"）のみ行う。
 *
 * server/chunks の欠落検査も build 時のみ。next dev では chunks が空の状態があり得る。
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { rimrafSync } from "rimraf";

const require = createRequire(import.meta.url);
const { resolveDistPath } = require("./resolve-next-dist-dir.cjs");

/** package.json 経由の next build 時のみ true（このとき routes-manifest が期待できる） */
function isNpmBuildScript() {
  return process.env.npm_lifecycle_event === "build";
}

const distPath = resolveDistPath();
const distName = path.basename(distPath);
const routesManifest = path.join(distPath, "routes-manifest.json");
const serverAppDir = path.join(distPath, "server", "app");
const serverChunksDir = path.join(distPath, "server", "chunks");

function chunksDirLooksBroken() {
  if (!fs.existsSync(serverAppDir)) return false;
  if (!fs.existsSync(serverChunksDir)) return true;
  try {
    const entries = fs.readdirSync(serverChunksDir);
    return entries.length === 0;
  } catch {
    return true;
  }
}

const routesManifestMissingBuild =
  isNpmBuildScript() && !fs.existsSync(routesManifest);

const chunksBrokenOnBuild =
  isNpmBuildScript() && chunksDirLooksBroken();

const shouldWipe =
  fs.existsSync(distPath) &&
  (routesManifestMissingBuild || chunksBrokenOnBuild);

if (shouldWipe) {
  const reason = routesManifestMissingBuild
    ? "routes-manifest.json がありません（本番ビルドの途中中断など）"
    : "server/chunks が無いか空です（本番ビルド成果物のチャンク欠落）";
  console.warn(
    `[next] "${distName}" が不整合です（${reason}）。フォルダを削除して再ビルドします。`
  );
  try {
    rimrafSync(distPath);
  } catch (err) {
    console.error(
      `[next] 出力フォルダを削除できませんでした。開発サーバー（next dev）を止めてから、もう一度 npm run dev を実行するか npm run dev:clean を試してください。`
    );
    process.exitCode = 1;
    throw err;
  }
}
