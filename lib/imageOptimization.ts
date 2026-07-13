/**
 * next/image で最適化（リサイズ・WebP化）してよい画像ソースか判定する。
 *
 * next/image は next.config の images.remotePatterns に登録されていないホストの
 * 画像を渡すと実行時エラーになる。管理画面から任意URLのサムネイルが登録され得るため、
 * 「登録済みホストのみ最適化し、それ以外は生 <img> にフォールバック」する用途で使う。
 *
 * ここで許可するホストは next.config.ts の remotePatterns と必ず一致させること。
 */
const OPTIMIZABLE_EXACT_HOSTS = new Set(['static.wixstatic.com', 'rakkoserver.com']);

export function canOptimizeImage(src: string | null | undefined): boolean {
  if (!src) return false;
  // ローカル(public/ 配信)は常に最適化可
  if (src.startsWith('/')) return true;
  try {
    const { hostname } = new URL(src);
    return OPTIMIZABLE_EXACT_HOSTS.has(hostname) || hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}
