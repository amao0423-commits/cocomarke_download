import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoTransactionalEmail } from '@/lib/sendBrevoTransactionalEmail';

const NOTIFY_TO = 'info@cocomake-guide.com';

const ACCOUNT_STATUS_LABEL: Record<string, string> = {
  has: '既にアカウントあり',
  planning: 'これから作成予定',
  none: 'アカウントなし・未定',
};

function s(v: unknown): string {
  return String(v ?? '').replace(/[\r\n]/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = s(body.name);
    const source = s(body.source);
    const plans = Array.isArray(body.plans) ? body.plans.map(s).filter(Boolean) : [];
    const options = Array.isArray(body.options) ? body.options.map(s).filter(Boolean) : [];
    const total = s(body.total);
    const startDate = s(body.startDate);
    const payment = s(body.payment);
    const email = s(body.email);
    const accountStatus = ACCOUNT_STATUS_LABEL[s(body.accountStatus)] || s(body.accountStatus) || '—';
    const accounts = Array.isArray(body.accounts) ? body.accounts.map(s).filter(Boolean) : [];

    const lines = [
      `お名前: ${name || '—'}`,
      source ? `流入: ${source}` : null,
      `プラン: ${plans.length ? plans.join('、') : '—'}`,
      options.length ? `オプション: ${options.join('、')}` : null,
      `合計月額: ${total ? `${total} 円（税込）` : '—'}`,
      `運用開始日（希望）: ${startDate || '—'}`,
      `お支払い方法: ${payment || '—'}`,
      `メール: ${email || '—'}`,
      `アカウント状況: ${accountStatus}`,
      accounts.length ? `Instagram ID: ${accounts.map((a: string) => '@' + a.replace(/^@/, '')).join('、')}` : null,
    ].filter((l) => l !== null) as string[];
    const bodyText = lines.join('\n');

    // 1) Slack 通知（複数の宛先に同内容を転送可。SLACK_WEBHOOK_URL をカンマ/空白区切りで複数指定）
    //    Webhook 未設定・失敗でも申込処理は継続。
    const webhooks = (process.env.SLACK_WEBHOOK_URL || '')
      .split(/[\s,]+/)
      .map((u) => u.trim())
      .filter(Boolean);
    const slackText = `:tada: *JEMIA 新規お申し込み*\n${bodyText}`;
    if (webhooks.length) {
      await Promise.all(
        webhooks.map(async (url) => {
          try {
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: slackText }),
            });
          } catch (e) {
            console.error('[onboarding] Slack通知に失敗', e);
          }
        })
      );
    } else {
      console.warn('[onboarding] SLACK_WEBHOOK_URL 未設定のためSlack通知をスキップ');
    }

    // 2) 管理者へメール通知（best-effort）
    try {
      await sendBrevoTransactionalEmail({
        to: NOTIFY_TO,
        subject: `【JEMIA お申し込み${source ? `・${source}` : ''}】${name ? `${name}様 / ` : ''}${plans.join('、') || 'プラン未選択'}`,
        html: `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${bodyText}</pre>`,
      });
    } catch (e) {
      console.error('[onboarding] 管理者メールに失敗', e);
    }

    // 3) お客様へ受付確認メール（best-effort）
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const reply = [
        name ? `${name} 様` : 'お客様',
        '',
        'この度はJEMIAへお申し込みいただき、誠にありがとうございます。',
        '以下の内容で受け付けいたしました。担当者による確認後、お支払い方法等について改めてご連絡いたします。',
        '',
        '──────────────',
        bodyText,
        '──────────────',
        '',
        '※運用開始日はあくまでご希望日です。状況や営業日により前後する場合があります。',
        '※本メールは送信専用アドレスからの自動返信です。お急ぎの場合は info@cocomake-guide.com までご連絡ください。',
        '',
        '━━━━━━━━━━━━━━━',
        'JEMIA（インスタ運用サブスク）',
        '株式会社ホットセラー／JEMIAマーケティング事業部',
        '東京都中央区晴海1-8-​16 晴海トリトンスクエアX棟',
        'info@cocomake-guide.com',
        'https://www.cocomake-guide.com/subscription',
        '━━━━━━━━━━━━━━━',
      ].join('\n');
      try {
        await sendBrevoTransactionalEmail({
          to: email,
          subject: '【JEMIA】お申し込みを受け付けました',
          html: `<pre style="font-family:sans-serif;font-size:14px;line-height:1.8;white-space:pre-wrap">${reply}</pre>`,
        });
      } catch (e) {
        console.error('[onboarding] 確認メールに失敗', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[onboarding]', err);
    return NextResponse.json({ ok: false, error: '送信に失敗しました。' }, { status: 500 });
  }
}
