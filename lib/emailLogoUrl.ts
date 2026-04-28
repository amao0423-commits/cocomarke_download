import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/** メール用ロゴ（public/images に配置） */
export const EMAIL_LOGO_PUBLIC_PATH = '/images/cocomarke-logo-email-horizontal.png';
export const BROADCAST_EMAIL_LOGO_PUBLIC_PATH = '/images/cocomarke-logo-broadcast.png';

const EMAIL_LOGO_FILENAME = 'cocomarke-logo-email-horizontal.png';
const BROADCAST_EMAIL_LOGO_FILENAME = 'cocomarke-logo-broadcast.png';

function shouldPreferEmbeddedLogoOverOrigin(origin: string): boolean {
  try {
    const h = new URL(origin).hostname.toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
  } catch {
    return false;
  }
}

function readImageDataUriFromDisk(filename: string): string {
  const candidates = [
    join(process.cwd(), 'public', 'images', filename),
    join(process.cwd(), 'images', filename),
  ];
  for (const fullPath of candidates) {
    try {
      if (!existsSync(fullPath)) continue;
      const buf = readFileSync(fullPath);
      return `data:image/png;base64,${buf.toString('base64')}`;
    } catch {
      // try next
    }
  }
  return '';
}

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
 * 公開オリジンが取れるときは絶対URL（localhost 等はメール受信側から参照できないため data URI を優先）。
 * それ以外は public の PNG を data URI で埋め込む。
 */
export function resolveEmailLogoUrlForOutbound(): string {
  const origin = getOutboundEmailSiteOrigin();
  const embedded = readImageDataUriFromDisk(EMAIL_LOGO_FILENAME);

  if (origin && !shouldPreferEmbeddedLogoOverOrigin(origin)) {
    return `${origin}${EMAIL_LOGO_PUBLIC_PATH}`;
  }

  if (embedded) {
    return embedded;
  }

  if (origin) {
    return `${origin}${EMAIL_LOGO_PUBLIC_PATH}`;
  }

  return '';
}

/** 一斉送信メールのロゴ用 src 値。指定ロゴがなければ通常ロゴへフォールバック。 */
export function resolveBroadcastEmailLogoUrl(): string {
  const origin = getOutboundEmailSiteOrigin();
  const embedded = readImageDataUriFromDisk(BROADCAST_EMAIL_LOGO_FILENAME);

  if (origin && !shouldPreferEmbeddedLogoOverOrigin(origin)) {
    return `${origin}${BROADCAST_EMAIL_LOGO_PUBLIC_PATH}`;
  }

  if (embedded) {
    return embedded;
  }

  if (origin) {
    return `${origin}${BROADCAST_EMAIL_LOGO_PUBLIC_PATH}`;
  }

  return resolveEmailLogoUrlForOutbound();
}

/**
 * メール HTML 内のロゴ・相対画像パスを送信時に解決する。
 * - {{emailLogoUrl}} を差し替え
 * - {{broadcastEmailLogoUrl}} を差し替え
 * - /images/cocomarke-logo-email-horizontal.png および旧 cocomarke-logo.png を解決済み URL に差し替え
 * - オリジンが分かるときは残りの src="/images/..." を絶対URLに変換
 */
export function applyEmailHtmlAssetUrls(html: string): string {
  const logoUrl = resolveEmailLogoUrlForOutbound();
  const broadcastLogoUrl = resolveBroadcastEmailLogoUrl();
  let out = html
    .replace(/\{\{emailLogoUrl\}\}/g, logoUrl)
    .replace(/\{\{broadcastEmailLogoUrl\}\}/g, broadcastLogoUrl);

  if (logoUrl) {
    out = out.replace(
      /src=(["'])\/images\/cocomarke-logo-email-horizontal\.png\1/gi,
      (_m, q: string) => `src=${q}${logoUrl}${q}`
    );
    out = out.replace(
      /src=(["'])\/images\/cocomarke-logo\.png\1/gi,
      (_m, q: string) => `src=${q}${logoUrl}${q}`
    );
  }
  if (broadcastLogoUrl) {
    out = out.replace(
      /src=(["'])\/images\/cocomarke-logo-broadcast\.png\1/gi,
      (_m, q: string) => `src=${q}${broadcastLogoUrl}${q}`
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
