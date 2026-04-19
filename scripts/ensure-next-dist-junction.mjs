/**
 * OneDrive 同期フォルダ内では `.next-local` への書き込みがロックされ EBUSY になりやすい。
 * Windows かつプロジェクトが OneDrive 配下のときだけ、`.next-local` を
 * %LOCALAPPDATA%\\cocomarke-portal-next\\<cwdハッシュ> へのディレクトリジャンクションにする。
 *
 * NEXT_DIST_DIR 指定時は何もしない（利用者の意図を優先）。
 */
import fs from "fs";
import path from "path";
import os from "os";
import { createHash } from "crypto";

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

function main() {
  if (process.platform !== "win32") return;

  if (process.env.NEXT_DIST_DIR?.trim()) return;

  const cwd = process.cwd();
  if (!/onedrive/i.test(cwd)) return;

  const link = path.join(cwd, ".next-local");
  const target = targetDirForOneDrive();
  fs.mkdirSync(target, { recursive: true });
  const targetN = normalizePath(target);

  if (fs.existsSync(link)) {
    let matches = false;
    try {
      matches =
        normalizePath(fs.realpathSync(link)) ===
        normalizePath(fs.realpathSync(targetN));
    } catch {
      matches = false;
    }
    if (matches) return;

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

  fs.symlinkSync(targetN, link, "junction");
}

main();
