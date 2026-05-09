const INDEXER_RPC = 'https://indexer-storage-turbo.0g.ai';
const EVM_RPC = 'https://evmrpc.0g.ai';
const STORAGE_SCAN = 'https://storagescan.0g.ai';

const ROOT_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

// Patches fetch globally to proxy HTTP storage node requests
function patchFetchForProxy() {
  if (typeof window === 'undefined') return;
  const _fetch = window.fetch.bind(window);
  (window as any).__0g_fetch_patched = true;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input
      : input instanceof URL ? input.toString()
      : (input as Request).url;

    // Intercept HTTP storage node calls (IP:PORT) and route through our proxy
    if (url.startsWith('http://') && /\d+\.\d+\.\d+\.\d+:\d+/.test(url)) {
      const proxyUrl = `/api/storage-proxy?url=${encodeURIComponent(url)}`;
      return _fetch(proxyUrl, init);
    }
    return _fetch(input, init);
  };
}

export interface UploadResult {
  rootHash: string;
  txHash: string;
  scanUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

// Inject Buffer polyfill globally before SDK usage
function ensureBuffer() {
  if (typeof window !== 'undefined') {
    if (!(window as any).Buffer) {
      try {
        const { Buffer } = require('buffer');
        (window as any).Buffer = Buffer;
        (globalThis as any).Buffer = Buffer;
      } catch (e) {
        console.error('Failed to polyfill Buffer:', e);
      }
    }
  }
}

export async function uploadToZeroG(
  file: File,
  walletProvider: any,
  onProgress?: (msg: string) => void
): Promise<UploadResult> {
  // Patch fetch BEFORE the SDK makes any calls
  if (typeof window !== 'undefined' && !(window as any).__0g_fetch_patched) {
    patchFetchForProxy();
  }

  // Ensure Buffer is available globally (required by ethers + 0g-ts-sdk)
  ensureBuffer();

  onProgress?.('Loading 0G Storage SDK...');
  
  // Use the /browser build for better compatibility
  const [{ Blob: ZgBlob, Indexer }, { ethers }] = await Promise.all([
    import('@0gfoundation/0g-storage-ts-sdk/browser'),
    import('ethers'),
  ]);

  onProgress?.('Connecting wallet...');
  const eip1193 =
    walletProvider?.transport?.type === 'custom' || walletProvider?.request
      ? walletProvider
      : (window as any).ethereum;

  const provider = new ethers.BrowserProvider(eip1193);
  const signer = await provider.getSigner();

  const zgBlob = new ZgBlob(file);

  onProgress?.(`Uploading ${file.name} to 0G Storage...`);
  const indexer = new Indexer(INDEXER_RPC);
  
  // MetaMask will now pop up to sign the transaction as usual
  const [tx, err] = await indexer.upload(zgBlob, EVM_RPC, signer as any);

  if (err || !tx) {
    console.error('0G Upload Error:', err);
    throw new Error(`Upload failed: ${err || 'unknown'}`);
  }

  const rootHash = 'rootHash' in tx ? (tx as any).rootHash : (tx as any).rootHashes?.[0];
  const txHash   = 'txHash'   in tx ? (tx as any).txHash   : (tx as any).txHashes?.[0];

  if (!rootHash) throw new Error('Upload succeeded but no root hash returned.');

  return {
    rootHash,
    txHash,
    scanUrl: `${STORAGE_SCAN}/file/${rootHash}`,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  };
}

export async function downloadFromZeroG(rootHash: string): Promise<Blob> {
  if (!ROOT_HASH_REGEX.test(rootHash)) {
    throw new Error('Invalid 0G storage root hash.');
  }

  // Same strategy for download — use our proxy to avoid Mixed Content
  // The official Storagescan format
  const downloadUrl = `https://indexer-storage-turbo.0g.ai/download/${rootHash}`;
  
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
       // If standard fails, try the node IP if we had it, but usually the indexer proxy works better
       throw new Error(`Failed to download from 0G: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    // If browser blocks mixed content on the direct node, we would proxy here too if needed
    console.warn('Primary download failed, attempting secondary strategy...');
    const resp = await fetch(`/api/proxy-0g?url=${encodeURIComponent(downloadUrl)}`);
    if (!resp.ok) throw new Error('Failed to retrieve file from 0G storage network.');
    return await resp.blob();
  }
}

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

export function storageScanUrlForTx(txHash: string) {
  return `${STORAGE_SCAN}/tx/${txHash}`;
}

export interface PostMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  rootHash: string;
  txHash: string;
  caption?: string;
  timestamp?: number;
}

export async function getFileUrl(rootHash: string): Promise<string> {
  try {
    const { Indexer, StorageNode } = await import('@0gfoundation/0g-storage-ts-sdk');
    const indexer = new Indexer(INDEXER_RPC);
    const [nodes, err] = await indexer.selectNodes(rootHash, 1);
    if (err || !nodes?.length) return '';

    const node = new StorageNode(nodes[0].url);
    const [fileInfo, infoErr] = await node.getFileInfo(rootHash);
    if (infoErr || !fileInfo) return '';

    // Handle large files by segments if needed, but for simple URLs we can use the indexer proxy
    return `https://indexer-storage-turbo.0g.ai/download/${rootHash}`;
  } catch {
    return '';
  }
}

export async function downloadPostMetadata(metadataRootHash: string): Promise<PostMetadata | null> {
  if (!metadataRootHash || metadataRootHash.length < 10) return null;
  try {
    const response = await fetch(`https://indexer-storage-turbo.0g.ai/download/${metadataRootHash}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error('Failed to download metadata:', e);
    return null;
  }
}
