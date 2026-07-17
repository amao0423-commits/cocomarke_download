/**
 * 分析API（ACCOUNT_OPTIMIZATION_API_KEY 経由の GrowthCore id-analytics）が返す
 * アカウント個別の分析テキストから「今後の運用への改善点」を組み立てる。
 *
 * API はアカウントごとに以下を返す（ルールベースの定型文ではなく実データ由来）:
 *  - analytics_message: string          … アカウント分析コメント
 *  - recommend_service_message: string[] … 個別のおすすめ提案
 *
 * これらが取得できない場合は null を返し、呼び出し側でルールベース
 * (buildImprovementFromMetrics) にフォールバックする。
 */
/** 改善点（今後の運用への改善点）＝ APIのアカウント分析(analytics_message)のみ。
 *  サービス提案(recommend_service_message)は含めない（別枠で扱う）。 */
export function buildImprovementFromApi(result: Record<string, unknown> | null | undefined): string[] | null {
  if (!result || typeof result !== 'object') return null;

  const analytics = (result as Record<string, unknown>).analytics_message;
  if (typeof analytics === 'string' && analytics.trim() !== '') {
    return [analytics.trim()];
  }

  return null;
}

/** おすすめサービス（別枠）＝ APIの recommend_service_message。 */
export function getRecommendServiceMessages(result: Record<string, unknown> | null | undefined): string[] {
  if (!result || typeof result !== 'object') return [];

  const recommend = (result as Record<string, unknown>).recommend_service_message;
  if (!Array.isArray(recommend)) return [];

  return recommend
    .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
    .map((item) => item.trim());
}
