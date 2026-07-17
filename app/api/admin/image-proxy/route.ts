import { NextRequest, NextResponse } from 'next/server';

/**
 * プロフィール画像を同一オリジン経由で返すプロキシ。
 * html-to-image で診断結果カードをPNG化する際、CORS制約で外部画像が
 * canvas に描画できず欠落するのを防ぐために使用する。
 * SSRF対策として許可ホストを、Instagram/Facebook CDN と
 * 分析API(GrowthCore)のプロフィール画像用S3バケットに限定する。
 */
const ALLOWED_HOST = /(?:^|\.)(?:cdninstagram\.com|fbcdn\.net)$/i;
// GrowthCore のプロフィール画像S3（例: growthcore-resource-bucket.s3.ap-northeast-2.amazonaws.com）
const ALLOWED_S3 = /^growthcore-resource-bucket\.s3[.-][a-z0-9-]+\.amazonaws\.com$/i;

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_HOST.test(hostname) || ALLOWED_S3.test(hostname);
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) {
    return new NextResponse('missing url', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse('invalid url', { status: 400 });
  }

  if (target.protocol !== 'https:' || !isAllowedHost(target.hostname)) {
    return new NextResponse('forbidden host', { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Referer: 'https://www.instagram.com/',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      cache: 'no-store',
    });
    if (!upstream.ok) {
      return new NextResponse('upstream error', { status: 502 });
    }
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'private, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    console.error('image-proxy error', e);
    return new NextResponse('fetch failed', { status: 502 });
  }
}
