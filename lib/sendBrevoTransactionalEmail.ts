import { BrevoClient } from '@getbrevo/brevo';

const DEFAULT_FROM_EMAIL = 'info@cocomake-guide.com';

function brevoClient(): BrevoClient {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('BREVO_API_KEY が設定されていません');
  }
  return new BrevoClient({ apiKey });
}

function senderEmail(): string {
  return process.env.BREVO_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

/** Brevo REST POST /v3/smtp/email（SDK の fetch で認証・ベース URL を共有） */
export async function sendBrevoTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const client = brevoClient();
  const body = {
    sender: { email: senderEmail() },
    to: [{ email: params.to }],
    subject: params.subject,
    htmlContent: params.html,
  };

  const res = await client.fetch('smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail.trim() || `Brevo 送信エラー (${res.status})`);
  }
}
