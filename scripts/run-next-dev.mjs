/**
 * Windows では Turbopack が `_buildManifest.js.tmp` の ENOENT を起こしやすい（OneDrive 以外でもあり得る）ため、
 * 既定は webpack の `next dev`。Turbopack は NEXT_DEV_TURBOPACK=1 のときのみ。
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const onWindows = process.platform === "win32";
const onWinOneDrive = onWindows && /onedrive/i.test(process.cwd());

const useTurbopack =
  process.env.NEXT_DEV_TURBOPACK === "1" ||
  (!onWindows && process.env.NEXT_DEV_TURBOPACK !== "0");

let nextBin;
try {
  nextBin = require.resolve("next/dist/bin/next");
} catch {
  console.error("[next] next パッケージが見つかりません。npm install を実行してください。");
  process.exit(1);
}

if (onWindows && !useTurbopack) {
  console.warn(
    "[next] Windows のため `next dev`（webpack）で起動します。Turbopack は NEXT_DEV_TURBOPACK=1（`_buildManifest.js.tmp` の ENOENT が出ることがあります）。"
  );
} else if (onWinOneDrive && useTurbopack) {
  console.warn(
    "[next] OneDrive 配下で Turbopack を使用しています。`_buildManifest.js.tmp` の ENOENT が出たら NEXT_DEV_TURBOPACK を外すか `npm run dev:clean` を試してください。"
  );
}

const args = [nextBin, "dev"];
if (useTurbopack) {
  args.push("--turbopack");
}

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
