/**
 * GrowthCore の result から現状フィードバック文をルールベースで生成する。
 * 評価・数値・コンテンツ構成をもとに日本語の短文を返す。
 */

export type MetricsInput = {
  follower_grade?: string;
  post_count_grade?: string;
  activity_grade?: string;
  total_grade?: string;
  follower_count?: number;
  post_count?: number;
  average_like_count?: number;
  average_comment_count?: number;
  average_post_hour?: number;
  photo_rate?: number;
  reels_rate?: number;
  carousel_rate?: number;
};

function normalizeGrade(g: unknown): string {
  if (g == null) return '';
  const s = String(g).trim();
  return s;
}

export function buildFeedbackFromMetrics(input: MetricsInput): string[] {
  const messages: string[] = [];

  const fGrade = normalizeGrade(input.follower_grade);
  const pGrade = normalizeGrade(input.post_count_grade);
  const aGrade = normalizeGrade(input.activity_grade);
  const tGrade = normalizeGrade(input.total_grade);

  if (fGrade === 'A') {
    messages.push('フォロワー数は十分な水準です。');
  } else if (fGrade === '不足') {
    messages.push('フォロワー数を増やすと、投稿のリーチが広がりやすくなります。');
  } else if (fGrade && fGrade !== '') {
    messages.push(`フォロワー評価は${fGrade}です。`);
  }

  if (pGrade === 'A') {
    messages.push('投稿数は十分にあります。');
  } else if (pGrade === '不足') {
    messages.push('投稿数を増やすと、アカウントの存在感が高まりやすくなります。');
  } else if (pGrade && pGrade !== '') {
    messages.push(`投稿数評価は${pGrade}です。`);
  }

  if (aGrade === 'A') {
    messages.push('投稿頻度は活発です。');
  } else if (aGrade === '不足') {
    messages.push('投稿頻度を上げると、露出が増えやすくなります。');
  } else if (aGrade && aGrade !== '') {
    messages.push(`活動性は${aGrade}です。`);
  }

  const avgHour = input.average_post_hour;
  if (typeof avgHour === 'number' && !Number.isNaN(avgHour) && avgHour > 0) {
    const days = Math.floor(avgHour / 24);
    if (days >= 7) {
      messages.push(`現在の投稿間隔はおおよそ${days}日ごとです。`);
    } else if (days >= 1) {
      messages.push(`投稿間隔はおおよそ${days}日程度です。`);
    } else {
      const hours = Math.round(avgHour);
      messages.push(`投稿間隔はおおよそ${hours}時間程度です。`);
    }
  }

  const photo = input.photo_rate ?? 0;
  const reels = input.reels_rate ?? 0;
  const carousel = input.carousel_rate ?? 0;
  const totalRate = photo + reels + carousel;
  if (totalRate > 0) {
    const maxVal = Math.max(photo, reels, carousel);
    if (reels === maxVal && reels >= 50) {
      messages.push('コンテンツはリール中心で、動画での発信が多めです。');
    } else if (photo === maxVal && photo >= 50) {
      messages.push('コンテンツは写真投稿が中心です。');
    } else if (carousel === maxVal && carousel >= 50) {
      messages.push('コンテンツはカルーセル投稿が中心です。');
    } else if (reels > 0 && photo > 0 && carousel > 0) {
      messages.push('写真・リール・カルーセルをバランスよく使えています。');
    }
  }

  if (tGrade === 'A') {
    messages.push('総合評価は良好です。');
  } else if (tGrade === '不足') {
    messages.push('総合的に伸ばす余地があります。フォロワー・投稿数・活動性のバランスを意識してみてください。');
  } else if (tGrade && tGrade !== '') {
    messages.push(`総合評価は${tGrade}です。`);
  }

  return messages;
}
