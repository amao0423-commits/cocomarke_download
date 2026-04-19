/**
 * OneDrive 配下ではビルド出力がロックされ EBUSY が出やすい。ファイル操作はせずヒントのみ。
 */
"use strict";

if (process.platform === "win32" && /onedrive/i.test(process.cwd())) {
  console.warn(
    "[next] OneDrive 配下です。ビルド出力はプロジェクト直下の .next-local を既定にします（next dev と相性のため AppData 絶対パスは使いません）。EBUSY やロックが続く場合: 同期を一時停止 / フォルダを C:\\dev などへ移す / npm run dev:clean / NEXT_DIST_DIR=.next"
  );
}
