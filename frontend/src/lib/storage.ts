'use client';

const INDEXER_RPC = 'https://indexer-storage-turbo.0g.ai';
const EVM_RPC = 'https://evmrpc.0g.ai';
const STORAGE_SCAN = 'https://storagescan.0g.ai';

export interface UploadResult {
  rootHash: string;
  txHash: string;
  scanUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface PostMetadata {
  caption?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  mediaRootHash?: string;
  storageScanUrl?: string;
  createdAt?: string;
}

// ── Patch fetch so HTTP storage-node calls go through our HTTPS proxy ──────
let _fetchPatched = false;
function patchFetchForProxy() {
  if (typeof window === 'undefined' || _fetchPatched) return;
  _fetchPatched = true;
  const _orig = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input
        : input instanceof URL ? input.toString()
          : (input as Request).url;
    if (url.startsWith('http://') && /\d+\.\d+\.\d+\.\d+:\d+/.test(url)) {
      return _orig(`/api/storage-proxy?url=${encodeURIComponent(url)}`, init);
    }
    return _orig(input, init);
  };
}

// ── Upload a file to 0G Storage ────────────────────────────────────────────
export async function uploadToZeroG(
  file: File,
  walletProvider: unknown,
  onProgress?: (msg: string) => void,
): Promise<UploadResult> {
  patchFetchForProxy();

  onProgress?.('Loading 0G SDK...');
  const [{ Blob: ZgBlob, Indexer }, { ethers }] = await Promise.all([
    import('@0gfoundation/0g-storage-ts-sdk/browser'),
    import('ethers'),
  ]);

  onProgress?.('Connecting wallet...');
  const provider = new ethers.BrowserProvider(walletProvider as any);
  const signer = await provider.getSigner();

  onProgress?.('Preparing file...');
  const zgBlob = new ZgBlob(file);


  onProgress?.(`Uploading ${file.name} to 0G Storage...`);
  const indexer = new Indexer(INDEXER_RPC);
  const [tx, err] = await indexer.upload(zgBlob, EVM_RPC, signer as any);

  if (err || !tx) throw new Error(`0G upload failed: ${String(err)}`);

  const rootHash = ('rootHash' in tx ? tx.rootHash : (tx as { rootHashes: string[] }).rootHashes[0]) as string;
  const txHash = ('txHash' in tx ? tx.txHash : (tx as { txHashes: string[] }).txHashes[0]) as string;

  return {
    rootHash,
    txHash,
    scanUrl: `${STORAGE_SCAN}/tx/${txHash}`,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
}

// ── Download a file from 0G Storage (returns object URL) ──────────────────
export async function downloadFromZeroG(rootHash: string): Promise<string> {
  if (!rootHash || rootHash.length < 10) return '';
  try {
    patchFetchForProxy();
    const { Indexer, StorageNode } = await import('@0gfoundation/0g-storage-ts-sdk/browser');

    const indexer = new Indexer(INDEXER_RPC);
    const [nodes, nErr] = await indexer.selectNodes(rootHash, 1);
    if (nErr || !nodes?.length) return '';

    const node = new StorageNode((nodes[0] as { url: string }).url);
    const [fileInfo, fErr] = await node.getFileInfo(rootHash);
    if (fErr || !fileInfo) return '';

    const fi = fileInfo as { numChunks: number; txSeq: number };
    const segs: Uint8Array[] = [];
    for (let i = 0; i < fi.numChunks; i++) {
      const [seg, sErr] = await node.downloadSegmentByTxSeq(fi.txSeq, i, true);
      if (sErr || !seg) break;
      segs.push(new Uint8Array(seg as any));
    }
    if (!segs.length) return '';

    const total = segs.reduce((s, b) => s + b.byteLength, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const s of segs) { merged.set(s, offset); offset += s.byteLength; }
    return URL.createObjectURL(new Blob([merged]));
  } catch {
    return '';
  }
}

// Alias kept for backward-compat
export const getFileUrl = downloadFromZeroG;

// ── Download + parse metadata JSON from 0G Storage ────────────────────────
export async function downloadPostMetadata(
  metadataRootHash: string,
): Promise<PostMetadata | null> {
  if (!metadataRootHash || metadataRootHash.length < 10) return null;
  try {
    const url = await downloadFromZeroG(metadataRootHash);
    if (!url) return null;
    const res = await fetch(url);
    return (await res.json()) as PostMetadata;
  } catch {
    return null;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function getMediaType(fileType: string): number {
  if (fileType.startsWith('video/')) return 2;
  if (fileType.startsWith('image/')) return 1;
  return 0;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}