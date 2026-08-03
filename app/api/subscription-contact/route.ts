import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';

const NOTIFY_TO = 'info@cocomake-guide.com';

// 流入経路 → 件名ラベル。フォーム側が送る source の値に対応。
const SUBJECT_LABELS: Record<string, string> = {
  consult:    'ご相談',         // 「無料で相談する」系ボタン
  plan_apply: '仮申込',         // 料金表「このプランで申し込む」
  diagnosis:  'プラン診断',     // プラン診断ページ経由
  corporate:  '法人問合せ',     // 法人お問い合わせフォーム
  shindan:    'インスタ運用診断', // shindan.html の診断完了通知
};

function sanitize(v: unknown): string {
  return String(v ?? '').replace(/[\r\n]/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.website) return NextResponse.json({ ok: true });

    const name         = sanitize(body.name);
    const email        = sanitize(body.email);
    const inquiryType  = sanitize(body.inquiry_type);
    const instagramId  = sanitize(body.instagram_id);
    const message      = String(body.message ?? '').trim();
    const source       = sanitize(body.source);
    const cta          = sanitize(body.cta);

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: '必須項目をご入力ください。' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'メールアドレスの形式が正しくありません。' }, { status: 400 });
    }

    // 流入元（first-touch のUTM・参照元）。フォームが attribution として送る。
    const attr = (body.attribution ?? {}) as Record<string, unknown>;
    const a = (k: string) => sanitize(attr[k]);
    const utmSource   = a('utm_source');
    const utmMedium   = a('utm_medium');
    const utmCampaign = a('utm_campaign');
    const utmContent  = a('utm_content');
    const referrer    = a('referrer');
    const landing     = a('landing');

    // 集客元の人が読みやすい要約（noteかMeta広告かを一目で）
    let channel = '不明（直接アクセス等）';
    if (utmSource) {
      channel = `${utmSource}${utmMedium ? ` / ${utmMedium}` : ''}`;
    } else if (referrer) {
      if (/note\.com/i.test(referrer)) channel = 'note（参照元より推定）';
      else if (/facebook|instagram|fb\.|fbclid/i.test(referrer)) channel = 'Meta（参照元より推定）';
      else channel = `参照元: ${referrer}`;
    }

    const rows = [
      `お名前: ${name}`,
      `メール: ${email}`,
      inquiryType  ? `ご希望プラン: ${inquiryType}`     : null,
      instagramId  ? `Instagram ID: @${instagramId}`   : null,
      '',
      'ご質問事項:',
      message || '（記載なし）',
      '',
      '──────────────',
      '【流入元情報】',
      `集客元: ${channel}`,
      cta          ? `申込ボタン: ${cta}`              : null,
      utmCampaign  ? `キャンペーン: ${utmCampaign}`     : null,
      utmContent   ? `広告/コンテンツ: ${utmContent}`  : null,
      referrer     ? `参照元(referrer): ${referrer}`   : null,
      landing      ? `ランディングURL: ${landing}`     : null,
    ].filter((l) => l !== null).join('\n');

    const subjectLabel = SUBJECT_LABELS[source] ?? 'ご相談';

    await sendBrevoTransactionalEmail({
      to:      NOTIFY_TO,
      subject: `【${subjectLabel}】JEMIA｜${name} 様${inquiryType ? `（${inquiryType}）` : ''}`,
      html:    `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${rows}</pre>`,
    });

    // お問い合わせ者への自動受付返信（送信失敗しても本処理は成功扱い）
    const autoReply = [
      `${name} 様`,
      '',
      'この度はJEMIAへお問い合わせいただき、誠にありがとうございます。',
      '以下の内容で受け付けいたしました。担当者より3日以内に、ご入力いただいたメールアドレス宛にご連絡いたします。',
      '',
      '──────────────',
      inquiryType ? `ご希望・ご相談プラン: ${inquiryType}` : null,
      'お問い合わせ内容:',
      message || '（記載なし）',
      '──────────────',
      '',
      '※本メールは送信専用アドレスからの自動返信です。ご返信いただいてもお答えできない場合がございます。',
      'お急ぎの場合は info@cocomake-guide.com までご連絡ください。',
      '',
      '━━━━━━━━━━━━━━━',
      'JEMIA（インスタ運用サブスク）',
      '株式会社ホットセラー／JEMIAマーケティング事業部',
      '東京都中央区晴海1-8-&#8203;16 晴海トリトンスクエアX棟',
      'info@cocomake-guide.com',
      'https://www.cocomake-guide.com/subscription',
      '━━━━━━━━━━━━━━━',
    ].filter((l) => l !== null).join('\n');
    try {
      await sendBrevoTransactionalEmail({
        to:      email,
        subject: '【JEMIA】お問い合わせを受け付けました',
        html:    `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${autoReply}</pre>`,
      });
    } catch (e) {
      console.error('[subscription-contact] 自動返信の送信に失敗', e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscription-contact]', err);
    return NextResponse.json({ ok: false, error: '送信に失敗しました。' }, { status: 500 });
  }
}
