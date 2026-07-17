/**
 * 分析結果から「今後の運用への改善点」をルールベースで生成する。
 * 実数値（フォロワー数・平均いいね/コメント・投稿構成比・投稿間隔など）を参照し、
 * 具体的で詳細なアカウント分析コメントを段落単位で返す。
 *
 * ── アドバイスの根拠（Instagram公式方針・最終レビュー: 2026-07）──────────────
 * ここに記載の助言は、Instagram責任者 Adam Mosseri らによる公式発信に基づく。
 * 方針が変わった場合は必ず本ファイルの文言を更新すること（下記の日付も更新）。
 *  - ハッシュタグ: 1投稿あたり最大5個。リーチを増やす効果はなく（Mosseri）、
 *    役割は「投稿内容の分類・検索の手がかり」。関連性の高い3〜5個に絞るのが推奨。
 *  - 主要ランキングシグナル(2026): ①ウォッチタイム（Reels、冒頭数秒の維持率）
 *    ②送信数/リーチ（DMシェア）＝新規リーチに最重要で「いいね」の約3〜5倍の重み
 *    ③いいね/リーチ（主に既存フォロワー向け）。
 *  - 新規リーチ: 公開投稿は少人数の非フォロワーに先行配信され、反応が良いほど
 *    段階的に拡大される（オーディション方式）。長尺Reels(最大3分)も非フォロワーに配信され得る。
 *  - 検索: キャプション・プロフィールのキーワードで検索表示されるため、
 *    「キーワードを自然に含めるSEO」がハッシュタグより有効。
 * ────────────────────────────────────────────────────────────────
 */

import type { MetricsInput } from './feedbackFromMetrics';

/** アドバイス根拠の最終レビュー日（公式方針の更新時にここも更新する） */
export const IMPROVEMENT_ADVICE_REVIEWED = '2026-07';

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

  // 1. エンゲージメントの現状と「送信(シェア)・保存」への最適化（現行アルゴリズムの最重要点）
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
      }件）。${judge}。現在のInstagramでは、リーチを最も左右する指標が「いいね」から「送信数（DMでのシェア）」へと移っており、送信は新規リーチにおいていいねより大きな影響を持ちます。そのため今後は「思わず友だちに送りたくなる」保存・共有価値のある投稿設計（保存版のノウハウ、あるあるネタ、チェックリスト等）を軸に据えてください。`
    );
  }

  // 2. コンテンツ構成比（写真／リール／カルーセル）とウォッチタイム最適化
  if (totalRate > 0) {
    const p = Math.round(photo);
    const r = Math.round(reels);
    const c = Math.round(carousel);
    let advice: string;
    if (reels < 30) {
      advice =
        'とくにリールの比率が低く、新規リーチの主要な入口を活かしきれていません。現行アルゴリズムで最重要の指標は「ウォッチタイム（視聴維持）」で、公開投稿はまず少人数の非フォロワーに先行配信され、反応が良いほど段階的に拡大されます。週に最低1〜2本、冒頭2〜3秒で内容が伝わるフックのあるリールを追加してください';
    } else if (carousel < 20) {
      advice =
        '保存が伸びやすいカルーセル（複数枚投稿）が少なめです。1枚目で結論やベネフィットを提示し、2〜10枚で手順や比較を見せる構成にすると、保存とシェア（送信）が伸びやすくなります';
    } else {
      advice =
        '写真・リール・カルーセルのバランスは概ね取れています。各フォーマットの役割（リール＝新規リーチとウォッチタイム、カルーセル＝保存、写真＝世界観づくり）を意識し、目的別に配分を最適化していきましょう';
    }
    messages.push(
      `直近の投稿構成は、写真${p}％・リール${r}％・カルーセル${c}％です。${advice}。とくにリールは冒頭で離脱されない設計（最初の1カットで結論・視覚的インパクト）が視聴維持に直結し、非フォロワーへの拡大可否を分けます。`
    );
  }

  // 3. 投稿頻度・タイミング
  if (avgHour != null && avgHour > 0) {
    const days = avgHour / 24;
    let cadence: string;
    if (days >= 3) {
      cadence = `現在の平均投稿間隔は約${days.toFixed(
        1
      )}日で、露出の機会を逃しやすい頻度です。まずは週2〜3回（2〜3日に1回）の定期投稿を90日続け、投稿リズムを固定することを最優先にしてください`;
    } else if (days >= 1) {
      cadence = `現在の平均投稿間隔は約${days.toFixed(
        1
      )}日で、安定した頻度を保てています。この頻度を維持しつつ、曜日・時間帯ごとの反応を比較し、最も伸びる枠に主力投稿を寄せていきましょう`;
    } else {
      cadence =
        '1日1回以上の高頻度で投稿できています。量は十分なので、今後は1投稿あたりの完成度（冒頭2秒のフック・視聴維持・保存/送信の動機づけ）に比重を移すと、質と量を両立できます';
    }
    messages.push(
      `${cadence}。投稿直後の初速（先行配信された非フォロワーの反応）が拡散可否を決めるため、フォロワーがオンラインになりやすい時間帯（一般に平日19〜22時前後）に合わせた予約投稿の活用がおすすめです。`
    );
  }

  // 4. フォロワー規模に応じた戦略＋プロフィール／検索(キーワード)最適化
  if (fGrade === '不足' || fGrade === 'D' || fGrade === 'C' || (followers != null && followers < 1000)) {
    messages.push(
      `フォロワー基盤にはまだ伸びしろがあります${
        followers != null ? `（現在${fmt(followers)}人）` : ''
      }。この段階では「広く浅く」よりも、テーマとターゲットを明確に絞った発信でコアなファンを増やすほうが、その後の伸びが加速します。あわせて、Instagramの検索はキャプションやプロフィールの“キーワード”を参照するため、名前欄・自己紹介・投稿文に検索されたい語句（地域名・サービス名・悩みワード）を自然に含める「キーワードSEO」を意識してください。プロフィールは "誰の何を解決するアカウントか" が3秒で伝わる状態に整えることが最優先です。`
    );
  }

  // 5. 投稿数の蓄積
  if (pGrade === '不足' || pGrade === 'D' || (posts != null && posts < 30)) {
    messages.push(
      `投稿の蓄積量がまだ少なめです${
        posts != null ? `（現在${fmt(posts)}投稿）` : ''
      }。プロフィール訪問者は過去投稿を見て「フォローする価値があるか」を判断するため、まずは主要テーマで30投稿を目標に、系統立てたコンテンツを積み上げましょう。過去に反応（とくに保存・送信）が良かった投稿は、切り口や見せ方を変えて再展開すると、効率よくアカウントの資産にできます。`
    );
  }

  // 6. ストーリーズ・DM（親密度シグナルと送信を後押し）
  messages.push(
    'ストーリーズは1日1〜2回を目安に、質問・アンケート・クイズなどのスタンプでフォロワーの反応を引き出してください。ストーリーズへの返信やスタンプは親密度シグナルを高め、フィードやリールの表示順位にも好影響を与えます。また、投稿の最後に「保存してね」「気になる人に送ってね」と具体的に行動を促す一文を添えると、現行アルゴリズムで重視される保存・送信（シェア）を後押しできます。ハイライトも「サービス」「お客様の声」「よくある質問」などテーマ別に整理し、新規訪問者が短時間でアカウントを理解できる導線を用意しましょう。'
  );

  return messages;
}
