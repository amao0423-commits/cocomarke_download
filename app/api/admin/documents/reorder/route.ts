import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/authAdmin';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const reorderSchema = z.object({
  items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0) })).min(1),
});

export async function PATCH(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase が未設定です' }, { status: 503 });
    }
    const json = await request.json();
    const parsed = reorderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: '入力が不正です' }, { status: 400 });
    }
    const updates = parsed.data.items.map(({ id, sort_order }) =>
      supabase.from('documents').update({ sort_order, updated_at: new Date().toISOString() }).eq('id', id),
    );
    await Promise.all(updates);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('documents reorder PATCH:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
