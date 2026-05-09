import { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Diamond, 
  Rocket, 
  BarChart3, 
  Wallet,
  Globe,
  Layers,
  Cpu
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
  useEffect(() => setMounted(true), []);

  const features = [
    { title: 'Hyper-Fast 0G Storage', desc: 'Decentralized media delivery that rivals traditional clouds in speed and cost.', icon: Zap },
    { title: 'Creator-First Economy', desc: 'Direct on-chain tipping and peer-to-peer engagement without middle-men.', icon: Diamond },
    { title: 'Censorship Resistant', desc: 'True data sovereignty. Your content is permanent, immutable, and owned by you.', icon: ShieldCheck },
  ];

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

      {/* Features Grid */}
      <div className="app-rail">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="fade-up" style={{
                padding: 40,
                animationDelay: `${i * 0.1}s`,
                borderRadius: 32,
                background: 'var(--bg-secondary)',
                transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
                onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-8px)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ 
                  width: 64, height: 64, borderRadius: 20, 
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', marginBottom: 8,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.03)'
                }}>
                  <Icon size={32} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="glass-panel fade-up" style={{
          marginTop: 100,
          padding: '80px 40px',
          borderRadius: 48,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'rgba(236, 72, 153, 0.03)',
          border: '1px solid var(--accent-glow)'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 70%)', opacity: 0.5, pointerEvents: 'none' }} />

          <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20, position: 'relative', color: 'var(--text)' }}>The Social Layer for Web 4.0</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 18, marginBottom: 40, maxWidth: 650, margin: '0 auto 40px', position: 'relative', lineHeight: 1.6, fontWeight: 500 }}>
            Escape centralized silos. Join the first high-performance social network where you are the sole owner of your digital footprint.
          </p>
          <button onClick={() => onNavigate('feed')} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 48px', borderRadius: 32, fontSize: 18, position: 'relative', fontWeight: 800, margin: '0 auto' }}>
            <Rocket size={22} />
            Start Posting to 0G
          </button>
        </div>
      </div>
    </div>
  );
}
