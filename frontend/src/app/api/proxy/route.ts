import { NextRequest, NextResponse } from 'next/server';
import { Indexer } from '@0gfoundation/0g-storage-ts-sdk';

const INDEXER_RPC = 'https://indexer-storage-turbo.0g.ai';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get('hash');

  if (!hash || !/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return NextResponse.json({ error: 'Invalid or missing hash' }, { status: 400 });
  }

  try {
    const indexer = new Indexer(INDEXER_RPC);
    
    // Download on server-side where Mixed Content isn't an issue
    const [blob, err] = await indexer.downloadToBlob(hash, { proof: false });

    if (err) {
      console.error(`Proxy download error for ${hash}:`, err);
      return NextResponse.json({ error: err.message || 'Download failed' }, { status: 500 });
    }
    
    if (!blob) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    // Return the blob as a stream with appropriate headers
    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    console.error('Proxy internal error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
