'use client';
import { useState, useEffect } from 'react';
import { 
  Zap, Diamond, ShieldCheck, Star, Wallet, PenLine, 
  Link2, Box, FileCode, ExternalLink, User,
  Rocket, BarChart3, Globe, Layers, Cpu
} from 'lucide-react';

const ZERO_G_LOGO = "https://pbs.twimg.com/profile_images/2038084529374867456/Oq74BA_I_400x400.jpg";

export default function LandingView({
  onNavigate, onConnect, isConnected, address
}: {
  onNavigate: (tab: any) => void;
  onConnect: () => void;
  isConnected: boolean;
  address?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 2800);
    return () => clearInterval(t);
  }, []);


  return (
    <div className="fade-up" style={{ paddingTop: 80, paddingBottom: 100, position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Immersive Background Atmosphere */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(circle at 50% 0%, var(--accent-glow) 0%, transparent 90%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 80%),
          radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 80%)
        `,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 120px',
        textAlign: 'center',
        zIndex: 1
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px',
            borderRadius: 30, fontSize: 11, fontWeight: 800, color: 'var(--accent)',
            marginBottom: 32, background: 'var(--accent-glow)', textTransform: 'uppercase',
            letterSpacing: 1.5, border: '1px solid var(--accent-glow)'
          }}>
            <img src={ZERO_G_LOGO} alt="0G" style={{ width: 18, height: 18, borderRadius: '50%' }} /> 0G Native SocialFi
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            color: 'var(--text)',
            textShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}>
            Own Your Content.<br />
            <span className="text-gradient">Powered by 0G Storage.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: 750,
            margin: '0 auto 48px',
            fontWeight: 500
          }}>
            SocialVault is a high-performance decentralized SocialFi platform.
            Post images, videos, and content that lives permanently on 0G Storage
            with lightning-fast access and near-zero fees.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
            marginBottom: 64
          }}>
            <button
              onClick={() => onNavigate('feed')}
              className="primary-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 40px', borderRadius: 32, fontSize: 16, fontWeight: 800 }}
            >
              <Rocket size={20} /> Explore Feed
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="secondary-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 40px', borderRadius: 32, fontSize: 16, fontWeight: 800, background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <BarChart3 size={20} /> Creator Dashboard
            </button>
            {mounted && !isConnected && (
              <button
                onClick={onConnect}
                className="secondary-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 40px', borderRadius: 32, fontSize: 16, fontWeight: 800, background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)' }}
              >
                <Wallet size={20} /> Connect Wallet
              </button>
            )}
          </div>

          {/* Social Proof / Mini Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, opacity: 0.9 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={20} className="text-gradient" /> 100%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>Data Sovereignty</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={20} className="text-gradient" /> 0G
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>Chain Native</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cpu size={20} className="text-gradient" /> ∞
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>Permanent Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE PROOF STRIP ──────────────────────────────────── */}
      <div style={{
        margin: '0 0 64px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div className="app-rail">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Live on</span>
            {[
              { label: '0G Mainnet', sub: 'ChainID: 16661', icon: <Link2 size={16} />, color: 'var(--accent)' },
              { label: '0G Storage Turbo', sub: 'storagescan.0g.ai', icon: <Box size={16} />, color: 'var(--accent2)' },
              { label: 'SocialVault Contract', sub: '0x368ab585…Ed24eB', icon: <FileCode size={16} />, color: '#10b981' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: item.color }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'monospace' }}>{item.sub}</div>
                </div>
              </div>
            ))}
            <a href="https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB"
              target="_blank" rel="noreferrer"
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                padding: '5px 14px', borderRadius: 999,
                background: 'rgba(109,67,242,0.08)',
                border: '1px solid rgba(109,67,242,0.2)',
                textDecoration: 'none', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
              View on ChainScan <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <div className="app-rail" style={{ marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Why SocialVault</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            Built different. Built permanent.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            {
              icon: <Zap size={24} />,
              title: 'Hyper-Fast 0G Storage',
              desc: 'Decentralized media delivery that rivals traditional clouds. Your files are sharded across 0G nodes — permanent, fast, and near-zero cost.',
              tag: '0G Storage',
              color: '#06b6d4',
              glow: 'rgba(6,182,212,0.12)',
              border: 'rgba(6,182,212,0.2)',
            },
            {
              icon: <Diamond size={24} />,
              title: 'Creator-First Economy',
              desc: 'Direct on-chain micro-tipping with automatic royalty splits. Zero platform extraction. Every 0G token goes straight to the creator.',
              tag: 'SocialFi',
              color: '#8b5cf6',
              glow: 'rgba(139,92,246,0.12)',
              border: 'rgba(139,92,246,0.2)',
            },
            {
              icon: <ShieldCheck size={24} />,
              title: 'Censorship Resistant',
              desc: 'True data sovereignty. Once posted, your content is immutable and permanently anchored on 0G Chain. No deletions, no gatekeepers.',
              tag: 'Sovereign',
              color: '#10b981',
              glow: 'rgba(16,185,129,0.12)',
              border: 'rgba(16,185,129,0.2)',
            },
          ].map((f, i) => (
            <div key={i} style={{
              padding: '28px 28px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'default',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 20px 48px ${f.glow}, var(--shadow-md)`;
              e.currentTarget.style.borderColor = f.border;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: f.glow, filter: 'blur(30px)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: f.glow, border: `1px solid ${f.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color
                }}>{f.icon}</div>
                <span style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 999,
                  background: f.glow, border: `1px solid ${f.border}`,
                  color: f.color, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{f.tag}</span>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 10, letterSpacing: '-0.02em', position: 'relative' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, position: 'relative' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <div className="app-rail" style={{ marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>How it Works</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            From post to permanent record
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { step: '01', icon: <Wallet size={20} />, title: 'Connect Your Wallet', desc: 'Use MetaMask or Rabby. The app auto-switches to 0G Mainnet (ChainID 16661).', color: '#8b5cf6' },
            { step: '02', icon: <PenLine size={20} />, title: 'Create Your Post', desc: 'Write text or attach media (images or video, up to 50 MB).', color: '#06b6d4' },
            { step: '03', icon: <Zap size={20} />, title: 'Upload to 0G Storage', desc: 'Your media is hashed and stored across 0G Turbo nodes. You get a Merkle root hash as your proof of storage.', color: '#f59e0b' },
            { step: '04', icon: <Link2 size={20} />, title: 'Anchored On-Chain', desc: 'The root hash is written to the SocialVault contract on 0G Chain — permanent and tamper-proof.', color: '#10b981' },
          ].map((item, i) => {
            const isActive = activeStep === i;
            return (
              <div key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: '22px 20px',
                  background: isActive ? `${item.color}0d` : 'var(--surface)',
                  border: `1px solid ${isActive ? item.color + '33' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  transform: isActive ? 'translateY(-3px)' : 'none',
                  boxShadow: isActive ? `0 12px 32px ${item.color}18` : 'var(--shadow-xs)',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 900, fontFamily: 'monospace',
                    color: isActive ? item.color : 'var(--text-faint)',
                    letterSpacing: '0.05em',
                  }}>{item.step}</span>
                  <span style={{ color: isActive ? item.color : 'var(--text-faint)' }}>{item.icon}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? 'var(--text)' : 'var(--text-muted)', marginBottom: 6 }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.6,
                  maxHeight: isActive ? 120 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease, opacity 0.25s ease',
                  opacity: isActive ? 1 : 0,
                }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
      <div className="app-rail" style={{ marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Community</div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            Early users are already posting
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { avatar: <User size={16} />, name: '0xf4a2…3e1b', note: 'Finally a social app where I actually own my posts. No more platform risk.' },
            { avatar: <Diamond size={16} />, name: '0x8bc1…99da', note: 'Got tipped 2 0G for my first post. Direct to wallet, no middleman.' },
            { avatar: <ShieldCheck size={16} />, name: '0x2d77…c0f3', note: 'Checked StorageScan — my image is actually on 0G nodes. This is real.' },
          ].map((proof, i) => (
            <div key={i} style={{
              padding: 22,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>{proof.avatar}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{proof.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>0G Mainnet user</div>
                </div>
                <Star size={14} style={{ marginLeft: 'auto', color: '#f59e0b' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "{proof.note}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <div className="app-rail">
        <div style={{
          padding: '56px 48px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(109,67,242,0.1) 0%, rgba(6,182,212,0.07) 50%, rgba(236,72,153,0.06) 100%)',
          border: '1px solid rgba(109,67,242,0.2)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(109,67,242,0.1) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block', fontSize: 11, padding: '4px 14px', borderRadius: 999,
              background: 'rgba(109,67,242,0.15)', border: '1px solid rgba(109,67,242,0.3)',
              color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 20,
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}>🏆 0G APAC Hackathon 2026 · Track 4</div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900,
              letterSpacing: '-0.03em', marginBottom: 16,
              background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 60%, var(--accent2) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              The Social Layer for Web 4.0
            </h2>

            <p style={{
              fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.65,
              maxWidth: 540, margin: '0 auto 36px',
            }}>
              Escape centralized silos. Join the first high-performance social network
              where you are the sole owner of your digital footprint.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('feed')}
                style={{
                  padding: '14px 36px', borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  border: 'none', color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(109,67,242,0.3)',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(109,67,242,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(109,67,242,0.3)'; }}
              >
                Start Posting to 0G <Zap size={16} />
              </button>
              <button
                onClick={() => onNavigate('about')}
                style={{
                  padding: '14px 32px', borderRadius: 999,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-muted)', fontSize: 15, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Learn More ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
