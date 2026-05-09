import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60; // Extend timeout for large file uploads

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const privateKey = formData.get('privateKey') as string;

    if (!file || !privateKey) {
      return NextResponse.json({ error: 'Missing file or privateKey' }, { status: 400 });
    }

    // Dynamic imports for server-side
    const { Blob: ZgBlob, Indexer } = await import('@0gfoundation/0g-storage-ts-sdk');
    const { ethers } = await import('ethers');

    const INDEXER_RPC = 'https://indexer-storage-turbo.0g.ai';
    const EVM_RPC = 'https://evmrpc.0g.ai';

    const provider = new ethers.JsonRpcProvider(EVM_RPC);
    const signer = new ethers.Wallet(privateKey, provider);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Create the 0G Blob
    const zgBlob = new ZgBlob(file);

    const indexer = new Indexer(INDEXER_RPC);
    
    console.log(`Server-side 0G Upload started for ${file.name} (${file.size} bytes)`);
    
    // This performs the multi-step upload and registration on-chain
    const [tx, err] = await indexer.upload(zgBlob, EVM_RPC, signer as any);

    if (err) {
      console.error('Server-side 0G Error:', err);
      return NextResponse.json({ error: `0G Storage upload failed: ${String(err)}` }, { status: 500 });
    }

    if (!tx) {
      return NextResponse.json({ error: 'Upload returned no transaction — check wallet balance.' }, { status: 500 });
    }

    const rootHash = (tx as any).rootHash || (tx as any).rootHashes?.[0];
    const txHash = (tx as any).txHash || (tx as any).txHashes?.[0];

    if (!rootHash) {
      return NextResponse.json({ error: 'Upload succeeded but no root hash returned.' }, { status: 500 });
    }

    return NextResponse.json({
      rootHash,
      txHash,
      scanUrl: `https://storagescan.0g.ai/file/${rootHash}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

  } catch (error: any) {
    console.error('Full Server-side 0G Failure:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
