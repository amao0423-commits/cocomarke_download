import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return map[mime] ?? 'bin';
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    let body: { mimeType?: unknown; fileSize?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON が不正です' }, { status: 400 });
    }

    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.trim() : '';
    const fileSize = typeof body.fileSize === 'number' ? body.fileSize : 0;

    if (!ALLOWED_IMAGE_MIME.includes(mimeType as (typeof ALLOWED_IMAGE_MIME)[number])) {
      return NextResponse.json(
        { error: '画像ファイル（JPEG・PNG・WebP・GIF・SVG）のみアップロードできます' },
        { status: 400 },
      );
    }

    if (fileSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズは10MB以内にしてください' },
        { status: 400 },
      );
    }

    const ext = extFromMime(mimeType);
    const objectPath = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;

    const { data, error } = await supabase.storage.from('images').createSignedUploadUrl(objectPath);

    if (error || !data) {
      console.error('images createSignedUploadUrl:', error);
      return NextResponse.json(
        { error: '署名付きアップロードURLの取得に失敗しました', details: error?.message ?? null },
        { status: 500 },
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    });
  } catch (e) {
    console.error('images upload-url POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
