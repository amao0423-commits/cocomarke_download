import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@/lib/validators/adminDocuments';
import { z } from 'zod';

export const runtime = 'nodejs';

function extFromFileName(name: string): string {
  const i = name.lastIndexOf('.');
  if (i <= 0) return '';
  return name.slice(i + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** サービスロールで Storage に直接アップロードし、documents 行を登録する */
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const formData = await request.formData();
    const titleRaw = formData.get('title');
    const categoryRaw = formData.get('category');
    const thumbnailUrlRaw = formData.get('thumbnail_url');
    const fileEntry = formData.get('file');
    const title = typeof titleRaw === 'string' ? titleRaw.trim() : '';
    const category =
      typeof categoryRaw === 'string' && categoryRaw.trim().length > 0
        ? categoryRaw.trim().slice(0, 200)
        : PRIVATE_CATEGORY_NAME;
    const thumbnailUrl =
      typeof thumbnailUrlRaw === 'string' && thumbnailUrlRaw.trim().length > 0
        ? thumbnailUrlRaw.trim()
        : null;
    if (thumbnailUrl && !z.string().url().safeParse(thumbnailUrl).success) {
      return NextResponse.json(
        { error: 'サムネイルURLの形式が不正です（https:// で始まるURLを指定してください）' },
        { status: 400 },
      );
    }
    if (!title) {
      return NextResponse.json({ error: '表示名を入力してください' }, { status: 400 });
    }

    if (!(fileEntry instanceof Blob)) {
      return NextResponse.json({ error: 'ファイルを選択してください' }, { status: 400 });
    }

    const fileName =
      typeof File !== 'undefined' && fileEntry instanceof File
        ? fileEntry.name
        : 'upload';
    const mimeType = fileEntry.type || 'application/octet-stream';
    const fileSize = fileEntry.size;

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズが大きすぎます（最大50MB）' },
        { status: 400 }
      );
    }
    if (
      !ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])
    ) {
      return NextResponse.json(
        { error: 'この形式のファイルはアップロードできません' },
        { status: 400 }
      );
    }

    const ext = extFromFileName(fileName) || 'bin';
    const objectPath = `files/${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;
    const buffer = Buffer.from(await fileEntry.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from('documents')
      .upload(objectPath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (upErr) {
      console.error('storage.upload:', upErr);
      return NextResponse.json(
        {
          error: 'ストレージへのアップロードに失敗しました',
          details: upErr.message,
        },
        { status: 500 }
      );
    }

    const { data: inserted, error: insErr } = await supabase
      .from('documents')
      .insert({
        title,
        storage_path: objectPath,
        file_name: fileName,
        file_size: fileSize,
        file_type: mimeType,
        download_url: null,
        thumbnail_url: thumbnailUrl,
        category,
      })
      .select()
      .single();

    if (insErr) {
      console.error('documents insert:', insErr);
      await supabase.storage.from('documents').remove([objectPath]);
      return NextResponse.json(
        { error: 'データベース登録に失敗しました', details: insErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ document: inserted });
  } catch (e) {
    console.error('documents upload POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
