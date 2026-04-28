import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/authAdmin';
import { deleteDownloadRequestsByIds } from '@/lib/downloadRequestsDb';

const bodySchema = z.object({
  ids: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(2000),
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

    const result = await deleteDownloadRequestsByIds(parsed.data.ids);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      deletedFromDb: result.deletedFromDb,
      removedFromRedis: result.removedFromRedis,
    });
  } catch (e) {
    console.error('bulk-delete POST:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
