/**
 * OneDrive 同期フォルダ内では `.next-local` への書き込みがロックされ EBUSY になりやすい。
 * Windows かつプロジェクトが OneDrive 配下のときだけ、`.next-local` を
 * %LOCALAPPDATA%\\cocomarke-portal-next\\<cwdハッシュ> へのディレクトリジャンクションにする。
 *
 * NEXT_DIST_DIR 指定時は何もしない（利用者の意図を優先）。
 */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { createHash } = require("crypto");

function targetDirForOneDrive() {
  const cwd = process.cwd();
  const key = createHash("sha256").update(cwd).digest("hex").slice(0, 16);
  return path.join(
    os.homedir(),
    "AppData",
    "Local",
    "cocomarke-portal-next",
    key
  );
}

function normalizePath(p) {
  return path.normalize(path.resolve(p));
}

/** realpathSync は破損ジャンクションでプロセスが落ちることがあるため使わない */
function linkPointsToTarget(linkPath, targetN) {
  try {
    const st = fs.lstatSync(linkPath);
    if (!st.isSymbolicLink()) return false;
    const raw = fs.readlinkSync(linkPath);
    const resolved = path.isAbsolute(raw)
      ? path.normalize(raw)
      : path.normalize(path.resolve(path.dirname(linkPath), raw));
    return resolved === targetN;
  } catch {
    return false;
  }
}

function main() {
  if (process.platform !== "win32") return;

  if (process.env.NEXT_DIST_DIR && process.env.NEXT_DIST_DIR.trim()) return;

  const cwd = process.cwd();
  if (!/onedrive/i.test(cwd)) return;

  const link = path.join(cwd, ".next-local");
  const target = targetDirForOneDrive();
  fs.mkdirSync(target, { recursive: true });
  const targetN = normalizePath(target);

  if (fs.existsSync(link)) {
    if (linkPointsToTarget(link, targetN)) return;

    const st = fs.lstatSync(link);
    if (st.isSymbolicLink()) {
      fs.unlinkSync(link);
    } else {
      fs.rmSync(link, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 200,
      });
    }
  }

  try {
    fs.symlinkSync(targetN, link, "junction");
  } catch (e) {
    const msg =
      e && typeof e === "object" && "message" in e
        ? String(e.message)
        : String(e);
    console.warn(
      "[next] .next-local へのジャンクションを作成できませんでした（管理者権限やウイルス対策の影響のことがあります）。そのまま OneDrive 上にビルド出力が残り、EBUSY が出る場合は npm run dev:clean を試してください。",
      msg
    );
  }
}

try {
  main();
} catch (e) {
  const msg =
    e && typeof e === "object" && "message" in e
      ? String(e.message)
      : String(e);
  console.error("[next] ensure-next-dist-junction で予期しないエラー:", msg);
  process.exitCode = 1;
}
