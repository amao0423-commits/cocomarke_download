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

/** npm run dev / dev:webpack / dev:clean など */
function isNpmDevScript() {
  const e = process.env.npm_lifecycle_event;
  return e === "dev" || e === "dev:webpack" || e === "dev:clean";
}

function isOneDriveProject() {
  return process.platform === "win32" && /onedrive/i.test(process.cwd());
}

function isWindowsDev() {
  return process.platform === "win32" && isNpmDevScript();
}

/** `_buildManifest.js` が既にあるのに `.tmp.*` が残っている（同期中断など）ときだけ削除 */
function removeStaleBuildManifestTmpFiles(distPath) {
  const devStatic = path.join(distPath, "static", "development");
  if (!fs.existsSync(devStatic)) return;
  let files;
  try {
    files = fs.readdirSync(devStatic);
  } catch {
    return;
  }
  if (!files.includes("_buildManifest.js")) return;
  for (const f of files) {
    if (!/_buildManifest\.js\.tmp\./.test(f)) continue;
    try {
      fs.unlinkSync(path.join(devStatic, f));
    } catch {
      // ロック中などは次回 dev で再試行
    }
  }
}

function wipeDevStaticDevelopment(distPath) {
  const devStatic = path.join(distPath, "static", "development");
  if (!fs.existsSync(devStatic)) return;
  try {
    rimrafSync(devStatic);
  } catch (err) {
    console.warn(
      `[next] 開発用静的出力の削除に失敗しました（続行します）: ${devStatic}`,
    );
  }
}

/**
 * next dev 中に OneDrive 同期・中断・手動削除で出力が欠損すると、
 * app-build-manifest.json や _buildManifest.js の ENOENT が連発する。
 * 典型的な破損パターンだけ検知して dist を捨て、次回 dev で再生成させる。
 */
function devDistMayBeCorrupt(distPath) {
  if (!fs.existsSync(distPath)) return false;

  const pageDir = path.join(distPath, "server", "app", "page");
  const pageManifest = path.join(pageDir, "app-build-manifest.json");
  if (fs.existsSync(pageDir) && !fs.existsSync(pageManifest)) {
    return true;
  }

  const devStatic = path.join(distPath, "static", "development");
  if (fs.existsSync(devStatic)) {
    let files = [];
    try {
      files = fs.readdirSync(devStatic);
    } catch {
      return true;
    }
    const hasBuildManifest = files.includes("_buildManifest.js");
    const hasTmp = files.some((f) => /_buildManifest\.js\.tmp\./.test(f));
    if (!hasBuildManifest && hasTmp) {
      return true;
    }
  }

  return false;
}

const distPath = resolveDistPath();
const distName = path.basename(distPath);

/**
 * Windows では `_buildManifest.js.tmp.*` の ENOENT（同期・ウイルス対策・rename 競合）が出やすい。
 * OneDrive 以外でも起動前に static/development を捨てて再生成させる（抑止: NEXT_SKIP_DEV_STATIC_WIPE=1）。
 * 非 Windows は従来どおり tmp 残骸のみ掃除。
 */
if (
  isNpmDevScript() &&
  process.env.NEXT_SKIP_DEV_STATIC_WIPE !== "1" &&
  fs.existsSync(distPath)
) {
  if (isWindowsDev()) {
    const devStatic = path.join(distPath, "static", "development");
    if (fs.existsSync(devStatic)) {
      const reason = isOneDriveProject()
        ? "OneDrive 配下のため"
        : "Windows 開発時のビルド一時ファイル競合を避けるため";
      console.warn(
        `[next] ${reason}、起動前に開発用静的出力をリセットします（${path.relative(process.cwd(), devStatic) || "static/development"}）。抑止: NEXT_SKIP_DEV_STATIC_WIPE=1`,
      );
      wipeDevStaticDevelopment(distPath);
    }
    try {
      fs.mkdirSync(devStatic, { recursive: true });
    } catch {
      // 続行（next dev が作成する）
    }
  } else {
    removeStaleBuildManifestTmpFiles(distPath);
  }
}

if (
  isNpmDevScript() &&
  process.env.NEXT_SKIP_DEV_DIST_REPAIR !== "1" &&
  fs.existsSync(distPath) &&
  devDistMayBeCorrupt(distPath)
) {
  console.warn(
    `[next] "${distName}" に開発用の欠損ファイルがあります（同期中断など）。削除してやり直します。`
  );
  try {
    rimrafSync(distPath);
  } catch (err) {
    console.error(
      `[next] 出力フォルダを削除できませんでした。開発サーバーを止めて npm run dev:clean を試してください。`
    );
    process.exitCode = 1;
    throw err;
  }
}

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
