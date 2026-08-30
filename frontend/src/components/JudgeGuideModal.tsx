import { useState } from 'react';
import { X, Award, ExternalLink, Code2, Database, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

interface JudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JudgeGuideModal({ isOpen, onClose }: JudgeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'storage' | 'contract' | 'links'>('overview');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
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
          maxWidth: 720,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
                  Judge & Evaluator Guide
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: 'var(--accent)',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontWeight: 800,
                  }}
                >
                  0G AKINDO Hackathon
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                Architecture overview & 0G proof verification checklist
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
              padding: 6,
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
            background: 'var(--bg)',
            padding: 4,
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          {[
            { id: 'overview', label: 'Executive Summary' },
            { id: 'storage', label: '0G Storage Integration' },
            { id: 'contract', label: '0G Chain Contract' },
            { id: 'links', label: 'Proof Receipts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
                borderRadius: 16,
                padding: 16,
              }}
            >
              <h4 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                🎯 What is SocialVault?
              </h4>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                SocialVault is a sovereign SocialFi platform built exclusively on the <strong>0G modular stack</strong>. 
                Instead of relying on centralized servers or slow IPFS gateways, all rich media and metadata JSON blobs are 
                stored natively on <strong>0G Storage Turbo Nodes</strong>, with post ownership and micro-tipping settled on <strong>0G Mainnet</strong>.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Database size={16} color="#0891b2" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>0G Storage Layer</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Uses official <code>@0gfoundation/0g-ts-sdk</code> to upload Merkle-tree ZgBlobs directly to 0G Turbo Indexer.
                </p>
              </div>

              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>0G Chain Settlement</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Live contract at <code>0xBb5f...547a</code> with on-chain likes, 0G Pay tipping, and creator royalties.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 16,
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                ⚡ 0G Storage Pipeline
              </h4>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li><strong>Media Ingestion:</strong> Images/videos are processed into <code>ZgBlob</code> objects via browser SDK.</li>
                <li><strong>Merkle Tree Construction:</strong> Chunked into 256KB segments with root hash computed client-side.</li>
                <li><strong>Turbo Indexer Upload:</strong> Sent to <code>https://indexer-storage-turbo.0g.ai</code> for zero-friction storage without complex gas approvals.</li>
                <li><strong>Metadata Anchoring:</strong> Post title, content, and author metadata JSON is separately hashed and committed.</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'contract' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 16,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 8 }}>
                // SocialVault.sol — Deployed on 0G Mainnet (Chain ID 16661)
              </div>
              <div style={{ color: 'var(--text)', lineHeight: 1.6 }}>
                address: <span style={{ color: 'var(--accent)' }}>{SOCIALVAULT_ADDRESS}</span><br />
                - createPost(storageRootHash, metadataRootHash, mediaType, royaltyBps)<br />
                - likePost(postId)<br />
                - tipPost(postId) payable<br />
                - updateProfile(profileHash)<br />
                - AgentNFT ERC-7857 for intelligent profile memory
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                title: 'Smart Contract on 0G ChainScan',
                url: `https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`,
                badge: '0G Mainnet',
              },
              {
                title: '0G Storage Explorer',
                url: 'https://storagescan.0g.ai',
                badge: '0G Storage',
              },
              {
                title: 'YouTube Video Walkthrough',
                url: 'https://youtu.be/vMZjEOf3uKA',
                badge: 'Demo Video',
              },
              {
                title: 'GitHub Source Code & Hardhat Tests',
                url: 'https://github.com/ritesh59697/0g-socialvault',
                badge: 'Open Source',
              },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                <span>{link.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      background: 'rgba(236, 72, 153, 0.15)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontWeight: 700,
                    }}
                  >
                    {link.badge}
                  </span>
                  <ExternalLink size={14} color="var(--text-muted)" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="primary-btn" style={{ padding: '8px 24px', borderRadius: 12, fontSize: 13 }}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
