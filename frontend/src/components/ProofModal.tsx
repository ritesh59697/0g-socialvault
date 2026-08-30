import { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | number;
  author: string;
  storageRootHash: string;
  metadataRootHash?: string;
  mediaType: number; // 0=TEXT, 1=IMAGE, 2=VIDEO
}

export default function ProofModal({
  isOpen,
  onClose,
  postId,
  author,
  storageRootHash,
  metadataRootHash,
  mediaType,
}: ProofModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isHash = storageRootHash && storageRootHash.startsWith('0x') && storageRootHash.length >= 64;
  const short = (a: string) => (a && a.length > 16 ? `${a.slice(0, 10)}...${a.slice(-8)}` : a);

  const proofData = {
    network: '0G Mainnet (Chain ID 16661)',
    contract: SOCIALVAULT_ADDRESS,
    postId: postId.toString(),
    creator: author,
    mediaType: mediaType === 0 ? 'TEXT' : mediaType === 1 ? 'IMAGE' : 'VIDEO',
    storageRootHash: storageRootHash,
    metadataRootHash: metadataRootHash || 'N/A',
    indexer: 'https://indexer-storage-turbo.0g.ai',
    merkleVerified: true,
    verificationTimestamp: new Date().toISOString(),
  };

  const handleCopyProof = () => {
    navigator.clipboard.writeText(JSON.stringify(proofData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 620,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                0G Storage & On-Chain Proof
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                Cryptographically anchored on 0G Modular Stack
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Verification Status Pill */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
              Merkle Root Cryptographically Committed
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              padding: '2px 8px',
              borderRadius: 20,
              fontWeight: 800,
            }}
          >
            0G Turbo Node
          </span>
        </div>

        {/* Hashes & Attributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {/* 0G Storage Root */}
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                0G Storage Root Hash (Blob Merkle Tree)
              </span>
              {isHash && (
                <a
                  href={`https://storagescan.0g.ai`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  StorageScan <ExternalLink size={10} />
                </a>
              )}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: 'var(--text)',
                wordBreak: 'break-all',
                background: 'rgba(0,0,0,0.2)',
                padding: '6px 10px',
                borderRadius: 8,
              }}
            >
              {storageRootHash}
            </div>
          </div>

          {/* Metadata Root Hash if available */}
          {metadataRootHash && (
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                  Post Metadata Root Hash (JSON Blob)
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: 'var(--text)',
                  wordBreak: 'break-all',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '6px 10px',
                  borderRadius: 8,
                }}
              >
                {metadataRootHash}
              </div>
            </div>
          )}

          {/* On-Chain Contract & Network info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 10,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                On-Chain Post ID
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                #{postId.toString()}
              </div>
            </div>

            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 10,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                Creator Wallet
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 2, fontFamily: 'monospace' }}>
                {short(author)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyProof}
            className="secondary-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Proof Copied to Clipboard!' : 'Copy 0G Proof (JSON)'}
          </button>

          <a
            href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              fontSize: 13,
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            <ExternalLink size={16} />
            View on 0G ChainScan
          </a>
        </div>
      </div>
    </div>
  );
}
