import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';

const NOTIFY_TO = 'info@cocomake-guide.com';

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

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: '必須項目をご入力ください。' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'メールアドレスの形式が正しくありません。' }, { status: 400 });
    }

    const rows = [
      `お名前: ${name}`,
      `メール: ${email}`,
      inquiryType  ? `ご希望プラン: ${inquiryType}`     : null,
      instagramId  ? `Instagram ID: @${instagramId}`   : null,
      '',
      'メッセージ:',
      message,
    ].filter((l) => l !== null).join('\n');

    await sendBrevoTransactionalEmail({
      to:      NOTIFY_TO,
      subject: `【JEMIA 仮申し込み】${name} 様より（${inquiryType || 'お問い合わせ'}）`,
      html:    `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${rows}</pre>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscription-contact]', err);
    return NextResponse.json({ ok: false, error: '送信に失敗しました。' }, { status: 500 });
  }
}
