/**
 * 「今後の運用への改善点」を組み立てる単一のソース。
 * 公開ページ（診断結果）と管理画面の両方からこの関数を使うことで、
 * 表示内容を必ず一致させる（公開はモザイク、管理は全件表示だが中身は同一）。
 *
 * 構成:
 *  1. 分析API(ACCOUNT_OPTIMIZATION_API_KEY)が返すアカウント個別分析 analytics_message
 *  2. メトリクス由来の詳細アドバイス（buildImprovementFromMetrics）で内容を補強・長文化
 *
 * ※ recommend_service_message（サービス提案）はここには含めない。
 */
import { buildImprovementFromMetrics } from './improvementFromMetrics';
import type { MetricsInput } from './feedbackFromMetrics';

export function buildImprovementMessage(
  result: Record<string, unknown> | null | undefined
): string[] {
  const out: string[] = [];

  if (result && typeof result === 'object') {
    const analytics = (result as Record<string, unknown>).analytics_message;
    if (typeof analytics === 'string' && analytics.trim() !== '') {
      out.push(analytics.trim());
    }
  }

  out.push(...buildImprovementFromMetrics((result ?? {}) as MetricsInput));

  return out;
}
