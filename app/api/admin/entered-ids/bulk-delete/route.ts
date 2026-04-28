import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/authAdmin';
import { removeEnteredIdsByKeys } from '@/lib/saveEnteredId';

const keySchema = z.object({
  id: z.string().trim().min(1).max(500),
  timestamp: z.string().trim().min(1).max(80),
});

const bodySchema = z.object({
  keys: z.array(keySchema).min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'JSON が不正です' }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join('; ') },
        { status: 400 }
      );
    }

    const removed = await removeEnteredIdsByKeys(parsed.data.keys);
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    console.error('entered-ids bulk-delete POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
