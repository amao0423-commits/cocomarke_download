import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// かんたんプランニング（プラン診断）の送信API
//   ① info@cocomake-guide.com へ回答内容を通知
//   ② 回答者へ「おすすめプラン＋お申し込み・総合資料」の案内メールを自動送信
// メール送信は既存サイトと同じ Brevo を使用。送信に失敗しても結果表示は成功扱い。

const NOTIFY_TO = 'info@cocomake-guide.com';
const BASE = 'https://www.cocomake-guide.com';
const APPLY_URL = `${BASE}/subscription/apply`;
const CONTACT_URL = `${BASE}/subscription?consult=1`; // マーケティング相談フォームを開くリンク
// 総合資料はブラウザ直リンク。各プラン別資料はおすすめプランとしてメールで送付。
const OVERVIEW_DOC = `${BASE}/docs/plan-overview.pdf`;
const PLAN_DOC: Record<string, string> = {
  like: `${BASE}/docs/plan-like.pdf`,
  boost: `${BASE}/docs/plan-boost.pdf`,
  set: `${BASE}/docs/plan-set.pdf`,
  rank: `${BASE}/docs/plan-rank.pdf`,
  premium: `${BASE}/docs/plan-overview.pdf`, // プレミアム専用資料は未作成のため総合資料を案内
};

const PLANS: Record<string, { name: string; price: string; why: string }> = {
  like: { name: 'いいね代行プラン', price: '9,800', why: 'ターゲット層への自動いいねで認知の入口をつくり、投稿の反応を底上げします。まず低コストで「見つけてもらう」土台づくりに最適です。' },
  boost: { name: '人気・おすすめ投稿表示プラン', price: '19,800', why: 'おすすめ・発見タブへの露出を強化し、新規リーチを最大化します。新規に知られたい方に最も効果的なプランです。' },
  set: { name: 'セットプラン', price: '24,980', why: 'いいね代行と人気・おすすめ投稿表示を組み合わせ、認知拡大とリーチを両立。伸び悩みを抜け出したい方に人気No.1の組み合わせです。' },
  rank: { name: 'アカウント上位表示プラン', price: '29,800', why: '狙ったキーワードでの検索上位を押し上げ、「エリア×業種」で見つけられる状態をつくります。指名・地域集客の強化に。' },
  premium: { name: 'プレミアムプラン', price: '49,800', why: '投稿代行を含めた専任担当が、戦略から実行までまるごと伴走。手間をかけずに、任せるだけで成果につながる運用が回ります。' },
};

const LABELS: Record<string, Record<string, string>> = {
  industry: { food: '飲食店', beauty: '美容・サロン', retail: '小売・EC', school: '教室・スクール', service: 'サービス業', other: 'その他' },
  issue: { reach: '新規の人に知られていない', convert: 'フォロワーは増えても集客につながらない', time: '投稿する時間がない', howto: '何をすればいいか分からない' },
  status: { none: 'まだ無い・作りたて', new: '始めたばかり', stuck: '運用中だが伸び悩み', growing: 'ある程度伸びている' },
  time: { none: 'ほぼ取れない', little: '少しなら取れる', enough: 'それなりに取れる' },
  budget: { b1: '〜1万円', b3: '1〜3万円', b5: '3〜5万円', b5over: '5万円以上・未定' },
};

const QNAME: Record<string, string> = { industry: '業種', issue: '悩み', status: '状況', time: '時間', budget: '予算' };

function esc(v: unknown): string {
  return String(v ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
}

// 送信内容を Supabase に保存（管理画面のタブで閲覧）。best-effort：失敗してもメール送信・結果表示は継続。
async function savePlanningRequest(fields: { email: string; accId?: string; planName: string; labels: Record<string, string>; note?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return; // 未設定ならスキップ
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('planning_requests').insert({
      email: fields.email,
      account_id: fields.accId ? '@' + fields.accId.replace(/^@/, '') : null,
      plan: fields.planName,
      industry: fields.labels.industry || null,
      issue: fields.labels.issue || null,
      status: fields.labels.status || null,
      time_available: fields.labels.time || null,
      budget: fields.labels.budget || null,
      note: (fields.note || '').trim() || null,
    });
    if (error) console.error('[planning] Supabase保存に失敗', error);
  } catch (e) {
    console.error('[planning] Supabase保存エラー', e);
  }
}

type Payload = { answers?: Record<string, string>; note?: string; email?: string; accId?: string; plan?: string };

export async function POST(req: NextRequest) {
  try {
    const { answers = {}, note, email, accId, plan } = (await req.json()) as Payload;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'メールアドレスの形式が正しくありません。' }, { status: 400 });
    }
    const p = (plan && PLANS[plan]) ? PLANS[plan] : PLANS.set;
    const planDoc = (plan && PLAN_DOC[plan]) ? PLAN_DOC[plan] : OVERVIEW_DOC;

    const answerRows = Object.entries(answers)
      .map(([k, v]) => `${QNAME[k] ?? k}: ${LABELS[k]?.[v] ?? v}`)
      .join('\n');

    // ① 社内通知
    const adminBody = [
      '■ かんたんプランニングの回答が届きました',
      '',
      `おすすめプラン: ${p.name}（月額 ${p.price}円〜）`,
      `メール: ${email}`,
      `アカウント: ${accId ? '@' + accId : '（未記入）'}`,
      '',
      answerRows,
      '',
      '補足:',
      (note && note.trim()) ? note.trim() : '（なし）',
    ].join('\n');

    await sendBrevoTransactionalEmail({
      to: NOTIFY_TO,
      subject: `【JEMIA／かんたんプランニング】${email}（${p.name}）`,
      html: `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${esc(adminBody)}</pre>`,
    });

    // ② 回答者への自動案内メール
    const html = `
      <div style="font-family:sans-serif;line-height:1.8;color:#1A1A1A;max-width:560px;">
        <p>この度はJEMIAの「かんたんプランニング」をご利用いただき、ありがとうございます。<br>いただいた回答をもとに、あなたに合ったプランをご提案します。</p>
        <div style="background:#E8F5ED;border-radius:12px;padding:20px 24px;margin:18px 0;">
          <p style="margin:0;color:#555;font-size:13px;">あなたへのおすすめプラン</p>
          <p style="margin:6px 0 0;font-size:20px;font-weight:bold;color:#1A5C37;">${esc(p.name)}</p>
          <p style="margin:4px 0 0;font-weight:bold;color:#2D7A4F;">月額 ${esc(p.price)} 円（税込）〜</p>
          <p style="margin:12px 0 0;font-size:14px;color:#475569;">${esc(p.why)}</p>
        </div>
        <p style="margin:22px 0 8px;font-weight:bold;">▼ 「${esc(p.name)}」の詳しい資料はこちら</p>
        <p style="margin:0 0 18px;"><a href="${planDoc}" style="display:inline-block;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:12px 22px;color:#1A1A1A;text-decoration:none;font-weight:bold;">プラン資料を見る（PDF）</a></p>
        <p style="margin:22px 0 8px;font-weight:bold;">▼ このプランで申し込む（お手続きはこちら）</p>
        <p style="margin:0 0 18px;"><a href="${APPLY_URL}" style="display:inline-block;background:#FF6633;border-radius:10px;padding:12px 26px;color:#fff;text-decoration:none;font-weight:bold;">お申し込み手続きへ進む</a></p>
        <p style="font-size:14px;color:#475569;">お申し込みは、月額固定・契約の縛りなし・初期費用0円です。<br>全プランをまとめた<a href="${OVERVIEW_DOC}" style="color:#2D7A4F;">総合資料</a>もご覧いただけます。<br>ご相談・お問い合わせは<a href="${CONTACT_URL}" style="color:#2D7A4F;">マーケティング相談フォーム</a>からどうぞ。</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:22px 0;">
        <p style="font-size:12px;color:#94a3b8;line-height:1.9;">
          ※本メールは送信専用アドレスからの自動送信です。ご返信いただければ担当者に届きます。<br><br>
          ━━━━━━━━━━━━━━━<br>
          JEMIA（インスタ運用サブスク）<br>
          株式会社ホットセラー／JEMIAマーケティング事業部<br>
          東京都中央区晴海1-8-<span>&#8203;</span>16 晴海トリトンスクエアX棟<br>
          info@cocomake-guide.com<br>
          <a href="${BASE}/subscription" style="color:#94a3b8;">https://www.cocomake-guide.com/subscription</a><br>
          ━━━━━━━━━━━━━━━
        </p>
      </div>`;

    try {
      await sendBrevoTransactionalEmail({
        to: email,
        subject: `【JEMIA】あなたのおすすめプラン「${p.name}」のご案内`,
        html,
      });
    } catch (e) {
      console.error('[planning] 自動案内メールの送信に失敗', e);
    }

    // ③ Supabase に記録（best-effort・管理画面で閲覧）
    const labels: Record<string, string> = {};
    for (const [k, v] of Object.entries(answers)) labels[k] = LABELS[k]?.[v] ?? v;
    await savePlanningRequest({ email, accId, planName: p.name, labels, note });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[planning]', err);
    return NextResponse.json({ ok: false, error: '送信に失敗しました。' }, { status: 500 });
  }
}
