/** 外部分析APIが返す韓国語エラーメッセージを日本語に変換するためのマップ */
const KO_TO_JA_ERROR_MAP: Record<string, string> = {
  '잠시후 다시 시도해주세요': '入力したユーザー名に誤りがあるか、しばらく経ってから再度お試しください。',
  '잠시 후 다시 시도해 주세요': '入力したユーザー名に誤りがあるか、しばらく経ってから再度お試しください。',
  '잠시 후 다시 시도해주세요': '入力したユーザー名に誤りがあるか、しばらく経ってから再度お試しください。',
  '다시 시도해 주세요': 'しばらく経ってから再度お試しください。',
  '다시 시도해주세요': 'しばらく経ってから再度お試しください。',
  '요청이 너무 많습니다': 'リクエストが多すぎます。しばらく経ってから再度お試しください。',
  '존재하지 않는 사용자입니다': '入力したユーザー名が見つかりません。正しいIDをご確認ください。',
  '사용자를 찾을 수 없습니다': '入力したユーザー名が見つかりません。正しいIDをご確認ください。',
  '오류가 발생했습니다': 'エラーが発生しました。しばらく経ってから再度お試しください。',
  '일시적인 오류입니다': '一時的なエラーです。しばらく経ってから再度お試しください。',
};

const GENERIC_ERROR = '分析結果を取得できませんでした。IDを確認するか、しばらく経ってから再度お試しください。';

/** URLや内部プロバイダ名・技術的詳細を含む可能性があるパターン */
const SENSITIVE_PATTERN = /https?:\/\/|api\.|\.co\.kr|\.com\/api|ACCOUNT_OPTIMIZATION|fetch failed|ECONNREFUSED|ETIMEDOUT/i;

/** 外部APIから返ってきたエラーメッセージを安全な日本語メッセージに変換（サーバー側で使用） */
export function toJapaneseError(message: string): string {
  const trimmed = message.trim();
  const mapped = KO_TO_JA_ERROR_MAP[trimmed];
  if (mapped) return mapped;
  if (/[가-힣]/.test(message)) {
    return GENERIC_ERROR;
  }
  // URLや内部プロバイダ名・技術詳細を含む場合は汎用メッセージに置換
  if (SENSITIVE_PATTERN.test(message)) {
    return GENERIC_ERROR;
  }
  return message;
}
