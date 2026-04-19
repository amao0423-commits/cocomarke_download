import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

type RangeParam = '7' | '30' | 'all';

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }

    const raw = request.nextUrl.searchParams.get('range') ?? '7';
    const range = (['7', '30', 'all'].includes(raw) ? raw : '7') as RangeParam;

    let pSince: string | null = null;
    if (range === '7') {
      pSince = new Date(Date.now() - 7 * 86400000).toISOString();
    } else if (range === '30') {
      pSince = new Date(Date.now() - 30 * 86400000).toISOString();
    }

    const { data: counts, error: rpcErr } = await supabase.rpc(
      'download_counts_by_document',
      { p_since: pSince }
    );

    if (rpcErr) {
      console.error('download-stats rpc:', rpcErr);
      return NextResponse.json({ error: '集計に失敗しました' }, { status: 500 });
    }

    const rows = (counts ?? []) as {
      document_id: string;
      download_count: number | string;
    }[];

    const ids = rows.map((r) => r.document_id).filter(Boolean);
    const titleById = new Map<string, string>();

    if (ids.length > 0) {
      const { data: docs } = await supabase
        .from('documents')
        .select('id, title')
        .in('id', ids);
      for (const d of docs ?? []) {
        titleById.set(d.id, d.title);
      }
    }

    const items = rows
      .map((r) => ({
        documentId: r.document_id,
        title: titleById.get(r.document_id) ?? '（タイトル不明）',
        count: Number(r.download_count) || 0,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ range, items });
  } catch (e) {
    console.error('download-stats:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
