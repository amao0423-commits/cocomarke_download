import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  uploadUrlBodySchema,
} from '@/lib/validators/adminDocuments';

function extFromFileName(name: string): string {
  const i = name.lastIndexOf('.');
  if (i <= 0) return '';
  return name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const json = await request.json();
    const parsed = uploadUrlBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const { fileName, mimeType, fileSize } = parsed.data;
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'ファイルサイズが大きすぎます（最大50MB）' }, { status: 400 });
    }
    if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
      return NextResponse.json({ error: 'この形式のファイルはアップロードできません' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const ext = extFromFileName(fileName) || 'bin';
    const objectPath = `files/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;

    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUploadUrl(objectPath);

    if (error || !data) {
      console.error('createSignedUploadUrl:', error);
      return NextResponse.json(
        {
          error: '署名付きアップロードURLの取得に失敗しました',
          details: error?.message ?? null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    });
  } catch (e) {
    console.error('upload-url:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
