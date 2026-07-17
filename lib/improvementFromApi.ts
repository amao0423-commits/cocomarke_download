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
export function buildImprovementFromApi(result: Record<string, unknown> | null | undefined): string[] | null {
  if (!result || typeof result !== 'object') return null;

  const out: string[] = [];

  const analytics = (result as Record<string, unknown>).analytics_message;
  if (typeof analytics === 'string' && analytics.trim() !== '') {
    out.push(analytics.trim());
  }

  const recommend = (result as Record<string, unknown>).recommend_service_message;
  if (Array.isArray(recommend)) {
    for (const item of recommend) {
      if (typeof item === 'string' && item.trim() !== '') {
        out.push(item.trim());
      }
    }
  }

  return out.length > 0 ? out : null;
}
