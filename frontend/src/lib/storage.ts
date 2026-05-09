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

// ── IndexedDB Cache for Media Blobs ─────────────────────────────────────────
const DB_NAME = 'SocialVault_MediaCache';
const STORE_NAME = 'blobs';

async function getDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Not in browser');
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedMedia(hash: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(hash);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setCachedMedia(hash: string, blob: Blob) {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(blob, hash);
  } catch (e) {
    console.warn('Failed to cache media:', e);
  }
}

// ── Patch fetch & XHR so HTTP storage-node calls go through our HTTPS proxy ──────
let _patched = false;
function patchNetworkForProxy() {
  if (typeof window === 'undefined' || _patched) return;
  _patched = true;

  const _origFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    if (url.startsWith('http://') && /\d+\.\d+\.\d+\.\d+:\d+/.test(url)) {
      return _origFetch(`/api/storage-proxy?url=${encodeURIComponent(url)}`, init);
    }
    return _origFetch(input, init);
  }) as typeof window.fetch;

  const _origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, method: string, url: string | URL, ...args: any[]) {
    const urlStr = typeof url === 'string' ? url : url.toString();
    if (urlStr.startsWith('http://') && /\d+\.\d+\.\d+\.\d+:\d+/.test(urlStr)) {
      const proxyUrl = `/api/storage-proxy?url=${encodeURIComponent(urlStr)}`;
      return _origOpen.apply(this, [method, proxyUrl, ...args] as any);
    }
    return _origOpen.apply(this, [method, url, ...args] as any);
  } as any;
}

// ── Upload a file to 0G Storage ────────────────────────────────────────────
export async function uploadToZeroG(
  file: File,
  walletProvider: unknown,
  onProgress?: (msg: string) => void,
): Promise<UploadResult> {
  patchNetworkForProxy();

  onProgress?.('Loading 0G SDK...');
  const [{ Blob: ZgBlob, Indexer }, { ethers }] = await Promise.all([
    // @ts-ignore
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
  const [tx, err] = (await indexer.upload(zgBlob, EVM_RPC, signer as any)) as [any, any];

  if (err || !tx) throw new Error(`0G upload failed: ${String(err || 'Unknown error')}`);

  const rootHash = ('rootHash' in tx ? tx.rootHash : (tx as any).rootHashes?.[0]) as string;
  const txHash = ('txHash' in tx ? tx.txHash : (tx as any).txHashes?.[0]) as string;

  if (!rootHash) throw new Error('Upload succeeded but no root hash was returned.');

  return {
    rootHash,
    txHash,
    scanUrl: `${STORAGE_SCAN}/tx/${txHash}`,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
}

// ── Download a file from 0G Storage (with Caching) ──────────────────
export async function downloadFromZeroG(rootHash: string): Promise<Blob> {
  if (!rootHash || rootHash.length < 10) throw new Error('Invalid root hash');
  
  // 1. Check cache first
  const cached = await getCachedMedia(rootHash);
  if (cached) return cached;

  patchNetworkForProxy();
  
  // 2. Download from 0G
  // @ts-ignore
  const { Indexer } = await import('@0gfoundation/0g-storage-ts-sdk/browser');
  const indexer = new Indexer(INDEXER_RPC);
  
  // Optimized download options: disable proof verification to save main thread CPU
  const [blob, err] = (await indexer.downloadToBlob(rootHash, { proof: false })) as [Blob, any];
  
  if (err || !blob) {
    console.error('Download error:', err);
    throw new Error(`Failed to download from 0G: ${String(err || 'Unknown')}`);
  }
  
  // 3. Set cache for next time
  await setCachedMedia(rootHash, blob);
  
  return blob;
}

// Alias kept for backward-compat
export async function getFileUrl(rootHash: string): Promise<string> {
  try {
    const blob = await downloadFromZeroG(rootHash);
    return URL.createObjectURL(blob);
  } catch {
    return '';
  }
}

// ── Download + parse metadata JSON from 0G Storage ────────────────────────
export async function downloadPostMetadata(
  metadataRootHash: string,
): Promise<PostMetadata | null> {
  if (!metadataRootHash || metadataRootHash.length < 10) return null;
  try {
    const blob = await downloadFromZeroG(metadataRootHash);
    const text = await blob.text();
    return JSON.parse(text) as PostMetadata;
  } catch (error) {
    console.error('Metadata parsing error:', error);
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