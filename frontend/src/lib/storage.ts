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
  onProgress?.('Preparing secure upload...');

  try {
    const { ethers } = await import('ethers');
    
    // walletProvider from wagmi connectorClient is an EIP-1193 provider
    const eip1193 =
      walletProvider?.transport?.type === 'custom' || walletProvider?.request
        ? walletProvider
        : (window as any).ethereum;

    const provider = new ethers.BrowserProvider(eip1193);
    const signer = await provider.getSigner();
    
    // Attempt to get private key for server-side upload
    // NOTE: This only works with burner wallets or specifically exported keys.
    let privateKey = '';
    try {
      // Some specialized signers might have this, or the user might be using a burner wallet
      privateKey = (signer as any)._signingKey?.()?.privateKey || (signer as any).privateKey || '';
    } catch (e) {
      console.warn('Could not extract private key directly:', e);
    }

    if (!privateKey) {
      // In production MetaMask, we can't get the PK. 
      // This is a limitation of the proxy-with-private-key approach.
      throw new Error('MetaMask does not allow private key export. Please use a burner wallet or paste your private key for production 0G uploads.');
    }

    onProgress?.(`Uploading ${file.name} to 0G via Proxy...`);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('privateKey', privateKey);

    const response = await fetch('/api/storage-upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload failed');
    }

    const result = await response.json();
    onProgress?.('Upload successful!');
    return result;
  } catch (error: any) {
    console.error('Upload Error:', error);
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
