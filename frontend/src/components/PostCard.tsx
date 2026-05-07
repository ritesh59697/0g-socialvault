'use client';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MediaPreview from '@/components/MediaPreview';
import ProfileAvatar from '@/components/ProfileAvatar';
import TransactionLink from '@/components/TransactionLink';

const short = (a: string) => `${a.slice(0,6)}...${a.slice(-4)}`;
const timeAgo = (ts: bigint) => {
  const d = Math.floor(Date.now()/1000) - Number(ts);
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d/60)}m ago`;
  if (d < 86400) return `${Math.floor(d/3600)}h ago`;
  return `${Math.floor(d/86400)}d ago`;
};
const isTextPost = (hash: string) => !hash.startsWith('0x') || hash.length < 60;
const TIP_PRESETS = ['0.005', '0.01', '0.05'];

export default function PostCard({
  post, isConnected, isWrongNetwork, liked, tipAmount, isTipping,
  onLike, onTip, onTipAmountChange,
}: {
  post: any; isConnected: boolean; isWrongNetwork: boolean;
  liked: boolean; tipAmount: string; isTipping: boolean;
  onLike: () => void; onTip: () => void;
  onTipAmountChange: (v: string) => void;
}) {
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    if (post.author) {
      const saved = localStorage.getItem(`sv_name_${post.author.toLowerCase()}`);
      if (saved) setAuthorName(saved);
    }
  }, [post.author]);

  const mediaType = Number(post.mediaType);
  const normalizedTip = tipAmount || '0.01';
  const tipLabel = Number(normalizedTip) > 0 ? `Send ${normalizedTip} 0G` : 'Send Tip';

  return (
    <div className="glass-panel fade-up" style={{
      padding: 24, marginBottom: 16,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
    >
      {/* Author row */}
      <div className="post-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Link href={`/profile/${post.author}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProfileAvatar address={post.author} size={42} />
          <div>
            <div className="hover-underline" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              {authorName || short(post.author)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>{timeAgo(post.timestamp)}</div>
          </div>
        </Link>
        <div className="post-badges" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {mediaType === 1 && <span className="glass-panel" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, color: 'var(--accent2)', fontWeight: 500, border: 'none', background: 'rgba(6,182,212,0.1)' }}>🖼️ Image</span>}
          {mediaType === 2 && <span className="glass-panel" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, color: 'var(--accent)', fontWeight: 500, border: 'none', background: 'var(--accent-glow)' }}>🎬 Video</span>}
          <a href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`} target="_blank" rel="noopener noreferrer" title="Open the SocialVault contract on 0G ChainScan" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 20, background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)',
            fontSize: 12, fontWeight: 600, boxShadow: 'none',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} className="pulse-dot" />Contract
          </a>
        </div>
      </div>

      {/* Content */}
      <div style={{ marginBottom: 20 }}>
        {mediaType === 0 || isTextPost(post.storageRootHash) ? (
          <p style={{
            fontSize: 15, lineHeight: 1.6, color: 'var(--text)',
            padding: '0 4px', margin: 0,
          }}>{post.storageRootHash}</p>
        ) : (
          <>
            <MediaPreview
              mediaRootHash={post.storageRootHash}
              metadataRootHash={post.metadataRootHash}
              mediaType={mediaType}
            />
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-faint)', fontFamily: 'monospace' }}>
              0G root: {post.storageRootHash.slice(0, 18)}...{post.storageRootHash.slice(-8)}
            </div>
          </>
        )}
      </div>

      <div className="post-proof-row" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 0 16px',
        borderTop: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ color: 'var(--text-faint)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Onchain Proof
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
            Confirm this post on 0G Mainnet.
          </div>
        </div>
        <TransactionLink postId={post.id} author={post.author} />
      </div>

      {/* Actions */}
      <div className="post-actions" style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <button onClick={onLike} disabled={!isConnected || isWrongNetwork} className="secondary-btn" style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          borderRadius: 24, fontSize: 13, fontWeight: 600,
          background: liked ? 'rgba(239,68,68,0.1)' : 'transparent',
          border: `1px solid ${liked ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
          color: liked ? 'var(--error)' : 'var(--text-muted)',
          cursor: isConnected && !isWrongNetwork ? 'pointer' : 'not-allowed',
        }}>
          <span style={{ fontSize: 16 }}>{liked ? '❤️' : '🤍'}</span> {post.likeCount.toString()}
        </button>

        <div className="tip-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 12,
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
          border: '1px solid var(--border)',
          minWidth: 320,
          flex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Support this creator</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pick an amount or enter your own in 0G.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Tip
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TIP_PRESETS.map((preset) => {
              const active = normalizedTip === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onTipAmountChange(preset)}
                  className="secondary-btn"
                  style={{
                    padding: '7px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: active ? 'rgba(34,211,238,0.12)' : 'transparent',
                    borderColor: active ? 'rgba(34,211,238,0.34)' : 'var(--border)',
                    color: active ? 'var(--accent2)' : 'var(--text-muted)',
                  }}
                >
                  {preset} 0G
                </button>
              );
            })}
          </div>

          <div className="tip-controls" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 12px',
              minHeight: 44,
              borderRadius: 14,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              flex: 1,
            }}>
              <span style={{ color: 'var(--text-faint)', fontSize: 12, fontWeight: 700 }}>0G</span>
              <input type="number" min="0" step="0.001" value={normalizedTip} onChange={e => onTipAmountChange(e.target.value)} style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: 15,
                outline: 'none',
                fontWeight: 700,
              }} />
            </div>
            <button onClick={onTip} disabled={!isConnected || isWrongNetwork || isTipping || Number(normalizedTip) <= 0} className="primary-btn" style={{
              minHeight: 44,
              padding: '0 18px',
              borderRadius: 14,
              fontSize: 13,
              whiteSpace: 'nowrap',
              opacity: isConnected && !isWrongNetwork && !isTipping && Number(normalizedTip) > 0 ? 1 : 0.55,
              cursor: isConnected && !isWrongNetwork && !isTipping && Number(normalizedTip) > 0 ? 'pointer' : 'not-allowed',
            }}>
              {isTipping ? 'Sending...' : tipLabel}
            </button>
          </div>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)', fontFamily: 'monospace' }}>#{post.id.toString()}</span>
      </div>
    </div>
  );
}
