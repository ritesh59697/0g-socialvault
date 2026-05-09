const INDEXER_RPC = 'https://indexer-storage-turbo.0g.ai';
const EVM_RPC = 'https://evmrpc.0g.ai';
const STORAGE_SCAN = 'https://storagescan.0g.ai';
const ROOT_HASH_REGEX = /^0x[0-9a-fA-F]{64}$/;

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
  // Ensure Buffer is available globally (required by ethers + 0g-ts-sdk)
  ensureBuffer();

  onProgress?.('Initializing 0G SDK...');

  try {
    // Dynamically import — keeps them out of the main bundle
    const [{ Blob: ZgBlob, Indexer }, { ethers }] =
      await Promise.all([
        import('@0gfoundation/0g-storage-ts-sdk'),
        import('ethers'),
      ]);

    // Re-verify Buffer after dynamic imports which might affect global state
    ensureBuffer();

  onProgress?.('Connecting wallet...');

  // walletProvider from wagmi connectorClient is an EIP-1193 provider
  // Fall back to window.ethereum if the provider doesn't look right
  const eip1193 =
    walletProvider?.transport?.type === 'custom' || walletProvider?.request
      ? walletProvider
      : (window as any).ethereum;

  if (!eip1193) throw new Error('No wallet provider found. Please connect a wallet.');

  const provider = new ethers.BrowserProvider(eip1193);
  const signer = await provider.getSigner();

  onProgress?.('Preparing file...');

  // Pass the file directly to ZgBlob
  const zgBlob = new ZgBlob(file);

    onProgress?.(`Uploading ${file.name} to 0G Storage...`);
    const indexer = new Indexer(INDEXER_RPC);
    const [tx, err] = await indexer.upload(zgBlob, EVM_RPC, signer as any);

    if (err) {
      console.error('0G Upload Error details:', err);
      throw new Error(`0G Storage upload failed: ${String(err)}`);
    }
    if (!tx) throw new Error('Upload returned no transaction — check your network and wallet balance.');

    const rootHash: string =
      typeof (tx as any).rootHash === 'string'
        ? (tx as any).rootHash
        : (tx as any).rootHashes?.[0] ?? '';
    const txHash: string =
      typeof (tx as any).txHash === 'string'
        ? (tx as any).txHash
        : (tx as any).txHashes?.[0] ?? '';

    if (!rootHash) throw new Error('Upload succeeded but no root hash returned.');

    return {
      rootHash,
      txHash,
      scanUrl: storageScanUrlForTx(txHash),
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
  } catch (error: any) {
    console.error('Full 0G Upload Failure:', error);
    throw error;
  }
}

export async function downloadFromZeroG(rootHash: string): Promise<Blob> {
  if (!ROOT_HASH_REGEX.test(rootHash)) {
    throw new Error('Invalid 0G storage root hash.');
  }

  // In production (HTTPS), use our API proxy to avoid Mixed Content blocks
  // (Browser blocks HTTPS -> HTTP requests to storage nodes)
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    try {
      const resp = await fetch(`/api/proxy?hash=${rootHash}`);
      if (resp.ok) return await resp.blob();
      console.warn(`Proxy download failed (${resp.status}), falling back to direct SDK download...`);
    } catch (e) {
      console.warn('Proxy download error, falling back to direct SDK download...', e);
    }
  }

  const { Indexer } = await import('@0gfoundation/0g-storage-ts-sdk');
  const indexer = new Indexer(INDEXER_RPC);
  const [blob, err] = await indexer.downloadToBlob(rootHash, { proof: false });

  if (err) throw new Error(`0G Storage download failed: ${err.message || String(err)}`);
  if (!blob) throw new Error('0G Storage returned no file data.');

  return blob;
}

export async function downloadPostMetadata(rootHash: string): Promise<PostMetadata | null> {
  if (!ROOT_HASH_REGEX.test(rootHash)) return null;

  const blob = await downloadFromZeroG(rootHash);
  const text = await blob.text();
  const metadata = JSON.parse(text) as PostMetadata;

  return metadata && typeof metadata === 'object' ? metadata : null;
}

export function storageScanUrlForTx(txHash: string): string {
  return txHash ? `${STORAGE_SCAN}/tx/${txHash}` : STORAGE_SCAN;
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
