import { SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MediaPreview from '@/components/MediaPreview';
import ProfileAvatar from '@/components/ProfileAvatar';
import TransactionLink from '@/components/TransactionLink';
import { 
  Heart, 
  Zap, 
  Trash2, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  ShieldCheck, 
  Globe,
  FileText
} from 'lucide-react';

const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
const timeAgo = (ts: bigint) => {
  const d = Math.floor(Date.now() / 1000) - Number(ts);
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
};
const isTextPost = (hash: string) => !hash.startsWith('0x') || hash.length < 60;
const TIP_PRESETS = ['0.005', '0.01', '0.05'];

const ZERO_G_LOGO = "https://pbs.twimg.com/profile_images/2038084529374867456/Oq74BA_I_400x400.jpg";

export default function PostCard({
  post, isConnected, isWrongNetwork, liked, tipAmount, isTipping,
  onLike, onTip, onTipAmountChange, isOwner,
}: {
  post: any; isConnected: boolean; isWrongNetwork: boolean;
  liked: boolean; tipAmount: string; isTipping: boolean;
  onLike: () => void; onTip: () => void;
  onTipAmountChange: (v: string) => void;
  isOwner?: boolean;
}) {
  const [authorName, setAuthorName] = useState<string | null>(null);

  useEffect(() => {
    const loadName = async () => {
      if (post.author) {
        const addr = post.author.toLowerCase();
        
        // 1. Try localStorage
        const saved = localStorage.getItem(`sv_name_${addr}`);
        if (saved) {
          setAuthorName(saved);
          return;
        }

        // 2. Try on-chain
        try {
          const { readContract } = await import('wagmi/actions');
          const { wagmiConfig: config } = await import('@/lib/wagmi');
          const { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } = await import('@/lib/contract');
          const { downloadFromZeroG } = await import('@/lib/storage');

          const hash = await readContract(config, {
            address: SOCIALVAULT_ADDRESS,
            abi: SOCIALVAULT_ABI,
            functionName: 'profileHashes',
            args: [post.author as `0x${string}`],
          }) as string;

          if (hash && hash.length > 10) {
            const blob = await downloadFromZeroG(hash);
            const data = JSON.parse(await blob.text());
            if (data.username) {
              setAuthorName(data.username);
              localStorage.setItem(`sv_name_${addr}`, data.username);
            }
          }
        } catch (e) {
          // Silent fail
        }
      }
    };
    loadName();
  }, [post.author]);

  const mediaType = Number(post.mediaType);
  const normalizedTip = tipAmount || '0.01';

  const OGLogo = ({ size = 14, glow = true }: { size?: number, glow?: boolean }) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      padding: size * 0.1,
      boxShadow: glow ? `0 0 ${size / 2}px rgba(167, 139, 250, 0.3)` : 'none',
      border: '1px solid rgba(255,255,255,0.25)',
      marginRight: 6, flexShrink: 0,
      position: 'relative', top: -1,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s infinite linear',
        zIndex: 1
      }} />
      <img src={ZERO_G_LOGO} alt="0G" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 0 }} />
    </div>
  );

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
          {mediaType === 1 && (
            <span className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '4px 10px', borderRadius: 20, color: 'var(--accent2)', fontWeight: 600, border: 'none', background: 'rgba(6,182,212,0.1)' }}>
              <ImageIcon size={12} /> Image
            </span>
          )}
          {mediaType === 2 && (
            <span className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '4px 10px', borderRadius: 20, color: 'var(--accent)', fontWeight: 600, border: 'none', background: 'var(--accent-glow)' }}>
              <VideoIcon size={12} /> Video
            </span>
          )}
          <a href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`} target="_blank" rel="noopener noreferrer" title="Open the SocialVault contract on 0G ChainScan" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 20, background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)',
            fontSize: 12, fontWeight: 700, boxShadow: 'none',
          }}>
            <ShieldCheck size={12} /> Contract
          </a>
        </div>
      </div>

      {/* Content */}
      <div style={{ marginBottom: 20 }}>
        {mediaType === 0 || isTextPost(post.storageRootHash) ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ color: 'var(--text-faint)', marginTop: 2 }}><FileText size={20} /></div>
            <p style={{
              fontSize: 15, lineHeight: 1.6, color: 'var(--text)',
              padding: '0 4px', margin: 0,
            }}>{post.storageRootHash}</p>
          </div>
        ) : (
          <>
            <MediaPreview
              mediaRootHash={post.storageRootHash}
              metadataRootHash={post.metadataRootHash}
              mediaType={mediaType}
            />
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)', fontFamily: 'monospace' }}>
              <Globe size={11} /> 0G Root: {post.storageRootHash.slice(0, 18)}...{post.storageRootHash.slice(-8)}
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
          <div style={{ color: 'var(--text-faint)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Onchain Proof
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
            Verify authenticity on 0G Mainnet
          </div>
        </div>
        <TransactionLink postId={post.id} author={post.author} />
      </div>

      {/* Actions */}
      <div className="post-actions" style={{ 
        display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' 
      }}>
        <button 
          onClick={onLike} 
          disabled={!isConnected || isWrongNetwork} 
          className="secondary-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 24, fontSize: 13, fontWeight: 700,
            background: liked ? 'rgba(239,68,68,0.08)' : 'transparent',
            border: `1px solid ${liked ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
            color: liked ? '#ef4444' : 'var(--text-muted)',
            cursor: isConnected && !isWrongNetwork ? 'pointer' : 'not-allowed',
          }}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> 
          {post.likeCount.toString()}
        </button>


        <div className="tip-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '12px 16px',
          borderRadius: 16,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          minWidth: 280,
          flex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)' }}>Support Creator</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tip in <OGLogo size={10} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TIP_PRESETS.map((preset) => {
              const active = normalizedTip === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onTipAmountChange(preset)}
                  className="secondary-btn"
                  style={{
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    background: active ? 'rgba(236,72,153,0.08)' : 'var(--bg)',
                    borderColor: active ? 'rgba(236,72,153,0.4)' : 'var(--border)',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {preset}
                </button>
              );
            })}
          </div>

          <div className="tip-controls" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 12px',
              minHeight: 38,
              borderRadius: 10,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              flex: 1,
            }}>
              <OGLogo size={12} />
              <input type="number" min="0" step="0.001" value={normalizedTip} onChange={e => onTipAmountChange(e.target.value)} style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: 14,
                outline: 'none',
                fontWeight: 700,
              }} />
            </div>
            <button 
              onClick={onTip} 
              disabled={!isConnected || isWrongNetwork || isTipping || Number(normalizedTip) <= 0} 
              className="primary-btn" 
              style={{
                minHeight: 38,
                padding: '0 16px',
                borderRadius: 10,
                fontSize: 12,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Zap size={14} fill={isTipping ? 'none' : 'currentColor'} className={isTipping ? 'pulse-dot' : ''} />
              {isTipping ? 'Processing...' : `Tip ${normalizedTip} 0G`}
            </button>
          </div>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-faint)', fontFamily: 'monospace', fontWeight: 600 }}>#{post.id.toString()}</span>
      </div>
    </div>
  );
}
