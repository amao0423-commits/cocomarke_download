import { NextRequest } from 'next/server';

export function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const providedKey =
    authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const adminSecretKey = process.env.ADMIN_SECRET_KEY;
  return !!(adminSecretKey && providedKey && providedKey === adminSecretKey);
}

export function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}
