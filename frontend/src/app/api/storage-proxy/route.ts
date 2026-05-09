import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// This proxies HTTP storage node requests through HTTPS
// The browser sends: POST /api/storage-proxy?url=http://34.71.110.60:5678/...
// The server forwards it to the actual node (no HTTPS restriction server-side)

export async function POST(req: NextRequest) {
  try {
    const targetUrl = req.nextUrl.searchParams.get('url');
    if (!targetUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    // Only allow 0G storage node IPs (basic security check)
    const allowed = /^https?:\/\/\d+\.\d+\.\d+\.\d+:\d+/.test(targetUrl);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.arrayBuffer();
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      // Don't forward host or connection headers
      if (!['host', 'connection', 'origin', 'referer'].includes(k.toLowerCase())) {
        headers[k] = v;
      }
    });

    const response = await fetch(targetUrl, {
      method: 'POST',
      body,
      headers,
    });

    const data = await response.arrayBuffer();
    
    const responseHeaders: Record<string, string> = {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    };

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('Proxy POST error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const targetUrl = req.nextUrl.searchParams.get('url');
    if (!targetUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 });

    const allowed = /^https?:\/\/\d+\.\d+\.\d+\.\d+:\d+/.test(targetUrl);
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const response = await fetch(targetUrl);
    const data = await response.arrayBuffer();
    
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
    });
  } catch (error: any) {
    console.error('Proxy GET error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
