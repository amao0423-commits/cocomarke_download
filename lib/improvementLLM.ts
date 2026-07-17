/**
 * 「今後の運用への改善点」を LLM（GitHub Models・無料）で生成する。
 *
 * - アカウントの実数値＋分析APIの所見(analytics_message)を渡し、
 *   アカウント固有・該当する課題だけ・長文のアドバイスを生成する。
 * - 公式ファクト（最新方針）をプロンプトで拘束し、古い定説や出典表記を禁止。
 * - トークン未設定・レート制限・失敗時はルールベース(buildImprovementMessage)へフォールバック。
 *
 * 必要な環境変数: GITHUB_MODELS_TOKEN（無ければ GITHUB_TOKEN）
 *   … GitHub の Fine-grained PAT で「Models: read」権限を付与したトークン。
 */
import { buildImprovementMessage } from './buildImprovement';

const ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const MODEL = 'openai/gpt-4o-mini';
const TIMEOUT_MS = 12000;

const SYSTEM_PROMPT = `あなたはInstagram運用支援の専門アドバイザーです。与えられたアカウントの実数値と、下記「公式ファクト（最新）」だけに基づき、日本語で「今後の運用への改善点」を作成します。

# 厳守事項
- 出力はJSON配列（string[]）のみ。各要素が改善点1項目。前後に説明文やコードフェンスを付けない。
- 項目数は4〜7。各項目は120〜220字程度の1段落。番号や見出しは付けない。
- **そのアカウントに実際に当てはまる課題だけ**を書く。当てはまらない一般論を無理に入れない。
  例: リール比率が既に高ければ「リールを増やせ」とは書かない。
      投稿頻度が既に適切なら頻度の指摘はしない。良い点は簡潔に触れる程度に留める。
- ハッシュタグの個数・種類には一切言及しない（1投稿あたりの正確な使用数が判定できず、
  過剰付けかどうか分からないため）。「ハッシュタグを減らせ／厳選しろ」とは書かない。
- 与えられた数値（フォロワー数・平均いいね/コメント・投稿構成比・投稿間隔など）を具体的に引用し、アカウント固有の内容にする。毎回同じ出だし・同じ言い回しにしない。
- 効果の大きい順に並べる。実行可能な具体アクションを示す。
- 出典・人名・「公式によると」等の根拠表記は本文に書かない（根拠は下記を土台にするだけ）。
- 古い定説（「ハッシュタグは30個」「ハッシュタグでリーチが伸びる」等）は書かない。誇大表現・保証（「必ず伸びる」）も禁止。

# 公式ファクト（最新の土台・本文には書かない）
- 主要ランキングシグナル: ①ウォッチタイム（特にReels。冒頭数秒の視聴維持）②送信数/リーチ（DMシェア）＝新規リーチに最も効く ③いいね/リーチ（主に既存フォロワー向け）。
- 新規リーチ: 公開投稿はまず少人数の非フォロワーに先行配信され、反応が良いほど拡大（オーディション方式）。
- 検索/発見: キャプションやプロフィールに検索されたいキーワードを自然に含めると発見されやすい（キーワードSEO）。
- ストーリーズの返信・スタンプは親密度シグナルを高め、表示順位に好影響。
- ハッシュタグは補助的な要素に過ぎずリーチを大きく左右しない。ただし本文では言及しないこと。

# トーン
専門的だが平易。相手は店舗・企業のSNS担当者。すぐ実行できる粒度で。`;

function num(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function buildUserPrompt(result: Record<string, unknown>): string {
  const g = (k: string) => {
    const v = result[k];
    return v == null || v === '' ? '不明' : String(v);
  };
  const followers = num(result.follower_count);
  const avgLike = num(result.average_like_count);
  const avgComment = num(result.average_comment_count);
  const avgHour = num(result.average_post_hour);
  const er =
    followers && followers > 0
      ? (((avgLike ?? 0) + (avgComment ?? 0)) / followers) * 100
      : null;

  const analytics =
    typeof result.analytics_message === 'string' ? result.analytics_message.trim() : '';

  return [
    '以下のアカウントの診断データです。改善点を作成してください。',
    '',
    `- フォロワー数: ${g('follower_count')}`,
    `- フォロー数: ${g('follow_count')}`,
    `- 投稿数: ${g('post_count')}`,
    `- 平均いいね: ${g('average_like_count')}`,
    `- 平均コメント: ${g('average_comment_count')}`,
    er != null ? `- 推定エンゲージメント率: 約${er.toFixed(1)}％` : '',
    avgHour != null ? `- 平均投稿間隔: 約${(avgHour / 24).toFixed(1)}日` : '',
    `- 投稿構成比: 写真 ${g('photo_rate')}% / リール ${g('reels_rate')}% / カルーセル ${g('carousel_rate')}%`,
    `- 評価: フォロワー ${g('follower_grade')} / 投稿数 ${g('post_count_grade')} / 活動性 ${g('activity_grade')} / 総合 ${g('total_grade')}`,
    analytics ? `- 分析ツールの所見: ${analytics}` : '',
    '',
    'この所見も踏まえ、当てはまる課題だけをJSON配列(string[])で出力してください。',
  ]
    .filter((l) => l !== '')
    .join('\n');
}

/** LLM応答からstring[]を頑健に取り出す */
function parsePoints(content: string): string[] {
  let text = content.trim();
  // コードフェンス除去
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  // JSON配列を探す
  try {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      const arr = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(arr)) {
        const out = arr
          .filter((x): x is string => typeof x === 'string' && x.trim() !== '')
          .map((x) => x.trim());
        if (out.length) return out;
      }
    }
  } catch {
    /* JSON でなければ行分割にフォールバック */
  }
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^\s*(?:[-*・]|\d+[.)])\s*/, '').trim())
    .filter((l) => l.length > 0);
}

export async function generateImprovementLLM(
  result: Record<string, unknown>
): Promise<string[]> {
  const token =
    process.env.GITHUB_MODELS_TOKEN ??
    process.env.GITHUB_TOKEN ??
    process.env.GH_MODELS_TOKEN ??
    process.env.GH_TOKEN ??
    process.env.MODELS_TOKEN;
  if (!token) {
    console.warn('[improvementLLM] フォールバック: トークン未設定', {
      GITHUB_MODELS_TOKEN: !!process.env.GITHUB_MODELS_TOKEN,
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      GH_MODELS_TOKEN: !!process.env.GH_MODELS_TOKEN,
      GH_TOKEN: !!process.env.GH_TOKEN,
      MODELS_TOKEN: !!process.env.MODELS_TOKEN,
    });
    return buildImprovementMessage(result);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        max_tokens: 1400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(result) },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn('[improvementLLM] フォールバック: LLM応答NG', {
        status: res.status,
        body: body.slice(0, 300),
      });
      return buildImprovementMessage(result);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || content.trim() === '') {
      console.warn('[improvementLLM] フォールバック: 応答が空');
      return buildImprovementMessage(result);
    }
    const points = parsePoints(content);
    if (points.length === 0) {
      console.warn('[improvementLLM] フォールバック: パース結果0件', {
        sample: content.slice(0, 200),
      });
      return buildImprovementMessage(result);
    }
    console.info('[improvementLLM] LLM生成成功', { points: points.length });
    return points;
  } catch (e) {
    console.error('[improvementLLM] フォールバック: 例外', {
      message: e instanceof Error ? e.message : String(e),
    });
    return buildImprovementMessage(result);
  } finally {
    clearTimeout(timer);
  }
}
