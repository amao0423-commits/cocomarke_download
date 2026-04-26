/**
 * OneDrive 配下ではビルド出力がロックされ EBUSY が出やすい。ファイル操作はせずヒントのみ。
 */
"use strict";

if (process.platform === "win32" && /onedrive/i.test(process.cwd())) {
  console.warn(
    "[next] OneDrive 配下です。ビルド出力はプロジェクト直下の .next-local を既定にします。Windows では `npm run dev` が webpack 版（Turbopack は NEXT_DEV_TURBOPACK=1）。起動前に static/development をリセットします（抑止: NEXT_SKIP_DEV_STATIC_WIPE=1）。EBUSY / _buildManifest.js.tmp の ENOENT が続く場合: 同期を一時停止 / フォルダを C:\\dev などへ移す / npm run dev:clean / NEXT_DIST_DIR=.next"
  );
}
