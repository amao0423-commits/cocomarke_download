import { NextRequest, NextResponse } from 'next/server';
import { PRIVATE_CATEGORY_NAME } from '@/lib/documentCategoryConstants';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ALLOWED_MIME_TYPES } from '@/lib/validators/adminDocuments';
import { z } from 'zod';

const registerSchema = z.object({
  title: z.string().min(1).max(500),
  storage_path: z.string().min(1),
  file_name: z.string().optional().nullable(),
  file_size: z.number().int().nonnegative().optional().nullable(),
  file_type: z.string().optional().nullable(),
  thumbnail_url: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  category: z.string().min(1).max(200).optional().nullable(),
});

/** ブラウザからSupabaseへの直接アップロード後にドキュメントレコードを登録する */
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const json = await request.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }

    const { title, storage_path, file_name, file_size, file_type, thumbnail_url, category } =
      parsed.data;

    if (!title.trim()) {
      return NextResponse.json({ error: '表示名を入力してください' }, { status: 400 });
    }

    const thumbnailUrl =
      typeof thumbnail_url === 'string' && thumbnail_url.trim().length > 0
        ? thumbnail_url.trim()
        : null;
    if (thumbnailUrl && !z.string().url().safeParse(thumbnailUrl).success) {
      return NextResponse.json(
        { error: 'サムネイルURLの形式が不正です（https:// で始まるURLを指定してください）' },
        { status: 400 },
      );
    }

    const categoryValue =
      typeof category === 'string' && category.trim().length > 0
        ? category.trim().slice(0, 200)
        : PRIVATE_CATEGORY_NAME;

    if (
      file_type &&
      !ALLOWED_MIME_TYPES.includes(file_type as (typeof ALLOWED_MIME_TYPES)[number])
    ) {
      return NextResponse.json(
        { error: 'この形式のファイルはアップロードできません' },
        { status: 400 },
      );
    }

    const { data: inserted, error: insErr } = await supabase
      .from('documents')
      .insert({
        title: title.trim(),
        storage_path,
        file_name: file_name ?? null,
        file_size: file_size ?? null,
        file_type: file_type ?? null,
        download_url: null,
        thumbnail_url: thumbnailUrl,
        category: categoryValue,
      })
      .select()
      .single();

    if (insErr) {
      console.error('documents register:', insErr);
      await supabase.storage.from('documents').remove([storage_path]);
      return NextResponse.json(
        { error: 'データベース登録に失敗しました', details: insErr.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ document: inserted });
  } catch (e) {
    console.error('documents register POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
