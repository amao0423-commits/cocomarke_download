import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/** メール用ロゴ（public/images に配置） */
export const EMAIL_LOGO_PUBLIC_PATH = '/images/cocomarke-logo-email-horizontal.png';

const EMAIL_LOGO_FILENAME = 'cocomarke-logo-email-horizontal.png';

/**
 * 公開サイトのオリジン（メール内の /images/... を絶対URLにする際に使用）。
 * 本番では NEXT_PUBLIC_SITE_URL または Vercel の VERCEL_URL を利用。
 */
export function getOutboundEmailSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');
  const v = process.env.VERCEL_URL?.trim();
  if (v) return v.startsWith('http') ? v.replace(/\/$/, '') : `https://${v}`;
  return '';
}

/**
 * 資料ダウンロードメールのロゴ用 src 値。
 * サイトURLが取れるときは絶対URL。取れないときは public の PNG を data URI で埋め込む。
 */
export function resolveEmailLogoUrlForOutbound(): string {
  const origin = getOutboundEmailSiteOrigin();
  if (origin) {
    return `${origin}${EMAIL_LOGO_PUBLIC_PATH}`;
  }
  try {
    const fullPath = join(process.cwd(), 'public', 'images', EMAIL_LOGO_FILENAME);
    if (existsSync(fullPath)) {
      const buf = readFileSync(fullPath);
      return `data:image/png;base64,${buf.toString('base64')}`;
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * メール HTML 内のロゴ・相対画像パスを送信時に解決する。
 * - {{emailLogoUrl}} を差し替え
 * - 旧テンプレの /images/cocomarke-logo.png をメール用ロゴに差し替え
 * - オリジンが分かるときは src="/images/..." を絶対URLに変換
 */
export function applyEmailHtmlAssetUrls(html: string): string {
  const logoUrl = resolveEmailLogoUrlForOutbound();
  let out = html.replace(/\{\{emailLogoUrl\}\}/g, logoUrl);

  if (logoUrl) {
    out = out.replace(
      /src=(["'])\/images\/cocomarke-logo\.png\1/gi,
      (_m, q: string) => `src=${q}${logoUrl}${q}`
    );
  }

  const origin = getOutboundEmailSiteOrigin();
  if (origin) {
    out = out.replace(
      /src=(["'])(\/images\/[^"'>\s]+)\1/g,
      (full, q: string, path: string) => {
        if (path.startsWith('//') || /^https?:/i.test(path)) return full;
        return `src=${q}${origin}${path}${q}`;
      }
    );
  }

  return out;
}
