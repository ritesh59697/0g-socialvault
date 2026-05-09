import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const contentType = req.headers.get('content-type') || 'application/octet-stream';
    const body = await req.arrayBuffer();

    console.log(`Proxying 0G Upload to: ${url} (${body.byteLength} bytes)`);

    const response = await axios.post(url, Buffer.from(body), {
      headers: {
        'Content-Type': contentType,
      },
      timeout: 30000,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Proxy Error:', error.message);
    return NextResponse.json(
      { error: error.message, details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}
