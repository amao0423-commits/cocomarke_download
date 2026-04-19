/**
 * GrowthCore の result から「今後の運用への改善点」をルールベースで生成する。
 * 評価・数値・コンテンツ構成をもとに、具体的な改善提案文を返す。
 */

import type { MetricsInput } from './feedbackFromMetrics';

function normalizeGrade(g: unknown): string {
  if (g == null) return '';
  return String(g).trim();
}

export function buildImprovementFromMetrics(input: MetricsInput): string[] {
  const messages: string[] = [];

  const fGrade = normalizeGrade(input.follower_grade);
  const pGrade = normalizeGrade(input.post_count_grade);
  const aGrade = normalizeGrade(input.activity_grade);
  const avgHour = input.average_post_hour;
  const photo = input.photo_rate ?? 0;
  const reels = input.reels_rate ?? 0;
  const carousel = input.carousel_rate ?? 0;
  const totalRate = photo + reels + carousel;

  if (fGrade === '不足' || fGrade === 'D' || fGrade === 'C') {
    messages.push(
      'エンゲージメント率を向上させるため、投稿時間を最適化し、フォロワーが最もアクティブな時間帯に合わせた投稿スケジュールを構築することをお勧めします。'
    );
  }

  messages.push(
    'ストーリーズ機能を活用し、フォロワーとの双方向コミュニケーションを強化することで、親近感を高め、リーチの拡大につなげることができます。'
  );

  if (typeof avgHour === 'number' && !Number.isNaN(avgHour) && avgHour >= 24 * 3) {
    messages.push(
      '投稿頻度を上げることでアルゴリズムへの露出が増えやすくなります。まずは週2〜3回の定期的な投稿から始めてみてください。'
    );
  }

  if (totalRate > 0 && reels < 40) {
    messages.push(
      'リール動画の投稿頻度を増やし、トレンドに合わせたコンテンツ制作を行うことで、新規フォロワーの獲得が期待できます。'
    );
  }

  if (pGrade === '不足' || pGrade === 'D') {
    messages.push(
      '投稿数を少しずつ増やし、アカウントの存在感を高めることで、検索や探索タブでの発見につながりやすくなります。'
    );
  }

  messages.push(
    'ハッシュタグ戦略を見直し、ニッチで競合が少ないタグを組み合わせることで、ターゲット層へのリーチ精度を高めることができます。'
  );

  return messages;
}
