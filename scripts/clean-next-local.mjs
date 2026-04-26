/**
 * Next の出力フォルダをまるごと削除（resolve-next-dist-dir.cjs と同じ解決）
 */
import { createRequire } from "module";
import { rimrafSync } from "rimraf";

const require = createRequire(import.meta.url);
const { resolveDistPath } = require("./resolve-next-dist-dir.cjs");

const dir = resolveDistPath();
rimrafSync(dir);
