/**
 * next.config.ts / clean-next-local.mjs / ensure-dist-complete.mjs から共通利用。
 *
 * Windows では既定を `.next-local`（プロジェクト直下の相対パス）にする。
 * OneDrive 配下でビルド出力を %LOCALAPPDATA% などの絶対パスにすると、Next.js の
 * `path.join(プロジェクト, distDir)` と trace 周りでパスが二重結合され ENOENT になる
 * ことがあるため、既定では絶対パスに逃がさない。
 *
 * OneDrive 等でロックが続く場合: 同期の一時停止 / プロジェクトを C:\dev など同期外へ移す /
 * `npm run dev:clean` / 環境変数 `NEXT_DIST_DIR=.next` などで上書き。
 *
 * 上書き: NEXT_DIST_DIR（相対を推奨）
 */
"use strict";

const path = require("path");

function resolveDistDir() {
  const fromEnv = process.env.NEXT_DIST_DIR?.trim();
  if (fromEnv) return fromEnv;

  if (process.platform !== "win32") {
    return undefined;
  }

  return ".next-local";
}

function resolveDistPath() {
  const d = resolveDistDir() ?? ".next";
  if (path.isAbsolute(d)) {
    return d;
  }
  return path.join(process.cwd(), d);
}

module.exports = { resolveDistDir, resolveDistPath };
