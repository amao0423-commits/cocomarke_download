import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const BUCKET = 'images';
const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'] as const;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

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

/** GET: アップロード済み画像の一覧 */
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
  }

  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return NextResponse.json({ error: '一覧の取得に失敗しました', details: error.message }, { status: 500 });
  }

  const files = (data ?? [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
      return {
        name: f.name,
        size: f.metadata?.size ?? null,
        created_at: f.created_at ?? null,
        public_url: urlData.publicUrl,
      };
    });

  return NextResponse.json({ files });
}

/** POST: 画像をアップロードして公開URLを返す */
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
  }

  const formData = await request.formData();
  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof Blob)) {
    return NextResponse.json({ error: 'ファイルを選択してください' }, { status: 400 });
  }

  const mimeType = fileEntry.type || 'application/octet-stream';
  if (!ALLOWED_IMAGE_MIME.includes(mimeType as (typeof ALLOWED_IMAGE_MIME)[number])) {
    return NextResponse.json({ error: '画像ファイル（JPEG・PNG・WebP・GIF・SVG）のみアップロードできます' }, { status: 400 });
  }

  if (fileEntry.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'ファイルサイズが大きすぎます（最大10MB）' }, { status: 400 });
  }

  const ext = extFromMime(mimeType);
  const objectPath = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
  const buffer = Buffer.from(await fileEntry.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (upErr) {
    return NextResponse.json({ error: 'アップロードに失敗しました', details: upErr.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

  return NextResponse.json({ public_url: urlData.publicUrl, name: objectPath });
}

function isSafeStorageObjectName(name: string): boolean {
  const t = name.trim();
  if (!t || t.length > 240) return false;
  if (t.includes('/') || t.includes('\\') || t.includes('..')) return false;
  if (t === '.emptyFolderPlaceholder') return false;
  return /^[\w.\-]+$/.test(t);
}

/** DELETE: アップロード済み画像を1件削除（バケット直下のオブジェクト名のみ） */
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
  }

  let body: { name?: unknown };
  try {
    body = (await request.json()) as { name?: unknown };
  } catch {
    return NextResponse.json({ error: 'JSON が不正です' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || !isSafeStorageObjectName(name)) {
    return NextResponse.json({ error: '削除対象のファイル名が不正です' }, { status: 400 });
  }

  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) {
    console.error('images DELETE:', error);
    return NextResponse.json(
      { error: '削除に失敗しました', details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
