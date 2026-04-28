/** SendGrid 送信に必要な環境変数が揃っているか */
export function sendgridConfigured(): boolean {
  return !!(
    process.env.SENDGRID_API_KEY?.trim() && process.env.SENDGRID_FROM_EMAIL?.trim()
  );
}
