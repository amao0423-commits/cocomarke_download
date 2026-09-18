const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

const DEFAULT_FROM_EMAIL = 'support@cocomarke.com';

/** Resend の既定レート上限は 2 リクエスト/秒。429 を受けたら待って再試行する。 */
const RATE_LIMIT_MAX_RETRIES = 4;
const RATE_LIMIT_FALLBACK_WAIT_MS = 600;

function resendApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY が設定されていません');
  }
  return apiKey;
}

function senderEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

/** 送信元アドレスの既定値（管理画面で未設定のときに使う） */
export function defaultSenderEmail(): string {
  return senderEmail();
}

function waitMsFromRetryAfter(header: string | null): number {
  if (!header) return RATE_LIMIT_FALLBACK_WAIT_MS;
  const sec = Number(header.trim());
  if (Number.isFinite(sec) && sec > 0) return Math.min(sec * 1000, 10_000);
  return RATE_LIMIT_FALLBACK_WAIT_MS;
}

/**
 * Resend REST POST https://api.resend.com/emails
 *
 * 送信元ドメイン（既定は cocomarke.com）は Resend 側で DNS 認証済みである必要がある。
 * 未認証のドメインを from に指定すると 403 が返る。
 */
export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  senderEmail?: string;
}): Promise<void> {
  const from = params.senderEmail?.trim() || senderEmail();
  const body = {
    from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
  };

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey()}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) return;

    // レート上限は少し待てば成功するので再試行する
    if (res.status === 429 && attempt < RATE_LIMIT_MAX_RETRIES) {
      const waitMs = waitMsFromRetryAfter(res.headers.get('retry-after'));
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    const detail = await res.text().catch(() => '');
    throw new Error(detail.trim() || `Resend 送信エラー (${res.status})`);
  }
}
