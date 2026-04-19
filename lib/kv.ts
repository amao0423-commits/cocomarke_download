import { Redis } from '@upstash/redis';

let client: Redis | null = null;

const PLACEHOLDER_URL_SNIPPETS = ['your-database-id.upstash.io', 'example.upstash.io'] as const;
const PLACEHOLDER_TOKEN_PATTERNS = [/^your_upstash/i, /^your[_-]?token$/i, /^placeholder$/i] as const;

function looksLikePlaceholderUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return PLACEHOLDER_URL_SNIPPETS.some((s) => host.includes(s.replace('https://', '').split('/')[0]));
  } catch {
    return true;
  }
}

function looksLikePlaceholderToken(token: string): boolean {
  const t = token.trim();
  return PLACEHOLDER_TOKEN_PATTERNS.some((re) => re.test(t)) || t.length < 10;
}

/**
 * Upstash Redis クライアントを返す。
 * 環境変数: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 */
export function getKv(): Redis {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL と UPSTASH_REDIS_REST_TOKEN を .env.local または Vercel の環境変数に設定してください。'
      );
    }
    if (looksLikePlaceholderUrl(url) || looksLikePlaceholderToken(token)) {
      throw new Error(
        'Upstash の接続先がサンプル値のままです。Upstash ダッシュボードで作成したデータベースの REST URL とトークンを .env.local（および本番の環境変数）に貼り替えてください。'
      );
    }
    client = new Redis({ url, token });
  }
  return client;
}
