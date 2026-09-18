/** Resend（トランザクションメール API）送信に必要な環境変数が揃っているか */
export function transactionalMailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY?.trim();
}
