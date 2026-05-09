import { 
  Info, 
  Database, 
  ShieldCheck, 
  MousePointer2, 
  Cpu, 
  CloudUpload, 
  Link as LinkIcon,
  Trophy
} from 'lucide-react';

export default function AboutView() {
  return (
    <div className="fade-up tab-panel">
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Info size={32} className="text-gradient" />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', margin: 0 }}>About SocialVault</h2>
        </div>
        <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 800, fontWeight: 500 }}>
          The next generation of decentralized social media, built on the ultra-fast, modular infrastructure of <span className="text-gradient" style={{ fontWeight: 700 }}>0G Network</span>.
        </p>
      </div>

      <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
        {/* Core Concept */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: 20 
          }}>
            <MousePointer2 size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>What is SocialVault?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 500 }}>
            SocialVault is a sovereign SocialFi platform where users truly own their data. Unlike Web2 platforms that sell your information, SocialVault anchors your digital footprint to a permanent, decentralized ledger.
          </p>
        </div>

        {/* 0G Storage */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, background: 'rgba(6, 182, 212, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent2)', marginBottom: 20 
          }}>
            <Database size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>Powered by 0G Storage</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 500 }}>
            Every image, video, and post you create is sharded and stored on 0G's modular storage network. This ensures your content is permanent, censorship-resistant, and instantly accessible.
          </p>
        </div>

        {/* AI Guardian */}
        <div className="glass-panel" style={{ padding: 32 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, background: 'rgba(139, 92, 246, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: 20 
          }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>AI Content Guardian</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 500 }}>
            SocialVault features an integrated AI Guardian that analyzes content in real-time before publishing. This ensures a safe ecosystem while maintaining decentralized integrity.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>How it works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '01', title: 'Connect & Create', desc: 'Connect your Web3 wallet and draft your post with text or media.', icon: MousePointer2 },
            { step: '02', title: 'AI Analysis', desc: 'The AI Guardian scans your content to ensure it meets community standards.', icon: Cpu },
            { step: '03', title: '0G Storage Upload', desc: 'Your media is hashed and uploaded to 0G Storage Turbo nodes.', icon: CloudUpload },
            { step: '04', title: 'On-Chain Commitment', desc: 'A permanent pointer is written to the 0G Chain, securing your post forever.', icon: LinkIcon }
          ].map((item) => (
            <div key={item.step} className="glass-panel" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ 
                fontSize: 24, fontWeight: 900, color: 'var(--accent)', opacity: 0.2, 
                fontFamily: 'monospace', width: 40 
              }}>{item.step}</div>
              <div style={{ 
                width: 40, height: 40, borderRadius: 10, background: 'var(--bg-secondary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' 
              }}>
                <item.icon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ 
        padding: 40, textAlign: 'center', background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)',
        borderRadius: 32
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <Trophy size={40} className="text-gradient" />
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, color: 'var(--text)' }}>Built for the 0G APAC Hackathon</h3>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
          SocialVault is a flagship project demonstrating the power of 0G’s modular stack to scale decentralized social applications to the next billion users.
        </p>
      </div>
    </div>
  );
}
