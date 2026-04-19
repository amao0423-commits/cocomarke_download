import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { sendTemplateTestEmail } from '@/lib/downloadEmail';

type Ctx = { params: Promise<{ id: string }> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest, context: Ctx) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;
    const body = await request.json();
    const to = typeof body?.to === 'string' ? body.to.trim() : '';
    const sampleName =
      typeof body?.sampleName === 'string' && body.sampleName.trim()
        ? body.sampleName.trim()
        : 'テスト 太郎';

    if (!to || !EMAIL_RE.test(to)) {
      return NextResponse.json(
        { error: '送信先メールアドレスを正しく入力してください' },
        { status: 400 }
      );
    }

    const result = await sendTemplateTestEmail({
      templateId: id,
      to,
      sampleName,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.reason ?? '送信に失敗しました' },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('test-send POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
