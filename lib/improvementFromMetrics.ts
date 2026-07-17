/**
 * 分析結果から「今後の運用への改善点」をルールベースで生成する。
 * 実数値（フォロワー数・平均いいね/コメント・投稿構成比・投稿間隔など）を
 * 参照し、具体的で詳細なアカウント分析コメントを段落単位で返す。
 */

import type { MetricsInput } from './feedbackFromMetrics';

function toNum(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function normalizeGrade(g: unknown): string {
  if (g == null) return '';
  return String(g).trim();
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString('ja-JP');
}

export function buildImprovementFromMetrics(input: MetricsInput): string[] {
  const messages: string[] = [];

  const fGrade = normalizeGrade(input.follower_grade);
  const pGrade = normalizeGrade(input.post_count_grade);

  const followers = toNum(input.follower_count);
  const posts = toNum(input.post_count);
  const avgLike = toNum(input.average_like_count);
  const avgComment = toNum(input.average_comment_count);
  const avgHour = toNum(input.average_post_hour);
  const photo = toNum(input.photo_rate) ?? 0;
  const reels = toNum(input.reels_rate) ?? 0;
  const carousel = toNum(input.carousel_rate) ?? 0;
  const totalRate = photo + reels + carousel;

  // 1. エンゲージメント率（実数値ベースの診断）
  if (followers && followers > 0 && (avgLike != null || avgComment != null)) {
    const eng = (avgLike ?? 0) + (avgComment ?? 0);
    const er = (eng / followers) * 100;
    const erText = er.toFixed(1);
    let judge: string;
    if (er >= 5) {
      judge = 'これは非常に高い水準で、フォロワーとの関係性が強く築けています';
    } else if (er >= 3) {
      judge = 'これは平均を上回る良好な水準です';
    } else if (er >= 1.5) {
      judge = 'これは一般的な水準で、まだ伸ばす余地があります';
    } else {
      judge = 'これは伸びしろが大きく、最優先で改善したい指標です';
    }
    messages.push(
      `現在のエンゲージメント率は約${erText}％です（フォロワー${fmt(followers)}人に対し、平均いいね${
        avgLike != null ? fmt(avgLike) : '—'
      }件・平均コメント${
        avgComment != null ? fmt(avgComment) : '—'
      }件）。${judge}。エンゲージメント率はアルゴリズム評価の中核で、とくに投稿直後30〜60分の反応（保存・コメント・シェア）が伸びるほど発見タブやおすすめへの露出が加速します。まずは「保存したくなる情報設計（一覧・比較・テンプレ化）」と「コメントを促す問いかけ」を各投稿に必ず1つずつ入れることを習慣化してください。`
    );
  }

  // 2. コンテンツ構成比（写真／リール／カルーセル）
  if (totalRate > 0) {
    const p = Math.round(photo);
    const r = Math.round(reels);
    const c = Math.round(carousel);
    let advice: string;
    if (reels < 30) {
      advice =
        'とくにリールの比率が低く、新規リーチの主要な入口を活かしきれていません。週に最低1〜2本、トレンド音源を使った15〜30秒のリールを追加すると、フォロワー外への露出が大きく伸びやすくなります';
    } else if (carousel < 20) {
      advice =
        '保存が伸びやすいカルーセル（複数枚投稿）が少なめです。ノウハウやビフォーアフターを2〜10枚でまとめる投稿を増やすと、保存数の底上げが期待できます';
    } else {
      advice =
        '写真・リール・カルーセルのバランスは概ね取れています。各フォーマットの役割（リール＝新規リーチ、カルーセル＝保存、写真＝世界観づくり）を意識し、目的別に配分を最適化していきましょう';
    }
    messages.push(
      `直近の投稿構成は、写真${p}％・リール${r}％・カルーセル${c}％です。${advice}。フォーマットごとに狙う成果（リーチ／保存／プロフィール遷移）を分けて設計し、月単位で比率と反応を振り返ると、改善が安定して積み上がります。`
    );
  }

  // 3. 投稿頻度・タイミング
  if (avgHour != null && avgHour > 0) {
    const days = avgHour / 24;
    let cadence: string;
    if (days >= 3) {
      cadence = `現在の平均投稿間隔は約${days.toFixed(
        1
      )}日で、アルゴリズム上は露出の機会を逃しやすい頻度です。まずは週2〜3回（2〜3日に1回）の定期投稿を90日続け、投稿リズムを固定することを最優先にしてください`;
    } else if (days >= 1) {
      cadence = `現在の平均投稿間隔は約${days.toFixed(
        1
      )}日で、安定した頻度を保てています。この頻度を維持しつつ、曜日・時間帯ごとの反応を比較し、最も伸びる枠に主力投稿を寄せていきましょう`;
    } else {
      cadence =
        '1日1回以上の高頻度で投稿できています。量は十分なので、今後は1投稿あたりの完成度（冒頭2秒のフック・サムネイル・保存動機）に比重を移すと、質と量を両立できます';
    }
    messages.push(
      `${cadence}。投稿直後の初速を高めるため、フォロワーがオンラインになりやすい時間帯（一般に平日19〜22時前後）に合わせた予約投稿の活用がおすすめです。`
    );
  }

  // 4. フォロワー規模に応じた戦略
  if (fGrade === '不足' || fGrade === 'D' || fGrade === 'C' || (followers != null && followers < 1000)) {
    messages.push(
      `フォロワー基盤にはまだ伸びしろがあります${
        followers != null ? `（現在${fmt(followers)}人）` : ''
      }。この段階では「広く浅く」よりも、テーマとターゲットを明確に絞った発信でコアなファンを増やすほうが、その後の伸びが加速します。プロフィール（1行目の肩書き・提供価値・行動導線）を見直し、"誰の何を解決するアカウントか" が3秒で伝わる状態に整えることを最優先にしてください。`
    );
  }

  // 5. 投稿数の蓄積
  if (pGrade === '不足' || pGrade === 'D' || (posts != null && posts < 30)) {
    messages.push(
      `投稿の蓄積量がまだ少なめです${
        posts != null ? `（現在${fmt(posts)}投稿）` : ''
      }。プロフィール訪問者は過去投稿を見て「フォローする価値があるか」を判断するため、まずは主要テーマで30投稿を目標に、系統立てたコンテンツを積み上げましょう。過去に反応が良かった投稿は、切り口や見せ方を変えて再展開すると、効率よくアカウントの資産にできます。`
    );
  }

  // 6. ハッシュタグ設計
  messages.push(
    'ハッシュタグは「大（10万件以上）・中（1〜10万件）・小（1万件未満）」を組み合わせ、各投稿で10〜15個を目安に設計してください。小・中規模で競合が少ないタグでの上位表示を狙いつつ、大規模タグで瞬間的なリーチを取る構成が、ターゲット層への到達精度を高めます。投稿ごとにどのタグ経由で流入したかをインサイトで確認し、効果の高いタグを絞り込んで資産化していきましょう。'
  );

  // 7. ストーリーズ・ハイライト
  messages.push(
    'ストーリーズは1日1〜2回を目安に、質問・アンケート・クイズなどのスタンプでフォロワーの反応を引き出してください。ストーリーズへの反応（返信・スタンプ）は親密度シグナルを高め、フィードやリールの表示順位にも好影響を与えます。ハイライトも「サービス」「お客様の声」「よくある質問」などテーマ別に整理し、新規訪問者が短時間でアカウントを理解できる導線を用意しましょう。'
  );

  return messages;
}
