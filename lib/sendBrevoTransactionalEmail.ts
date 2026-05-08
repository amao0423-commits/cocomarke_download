const BREVO_SMTP_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email';

const DEFAULT_FROM_EMAIL = 'info@cocomake-guide.com';

function brevoApiKey(): string {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('BREVO_API_KEY が設定されていません');
  }
  return apiKey;
}

function senderEmail(): string {
  return process.env.BREVO_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

/** Brevo REST POST https://api.brevo.com/v3/smtp/email（絶対 URL で送信し ERR_INVALID_URL を避ける） */
export async function sendBrevoTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const body = {
    sender: { email: senderEmail() },
    to: [{ email: params.to }],
    subject: params.subject,
    htmlContent: params.html,
  };

  const res = await fetch(BREVO_SMTP_EMAIL_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': brevoApiKey(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail.trim() || `Brevo 送信エラー (${res.status})`);
  }
}
