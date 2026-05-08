/** Brevo（トランザクションメール API）送信に必要な環境変数が揃っているか */
export function brevoMailConfigured(): boolean {
  return !!process.env.BREVO_API_KEY?.trim();
}
