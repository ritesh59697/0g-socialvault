import { 
  Link as LinkIcon, 
  Database, 
  Globe, 
  BookOpen, 
  ArrowRightLeft, 
  Coins,
  ExternalLink
} from 'lucide-react';

const ECOSYSTEM = [
  { name: 'ChainScan Explorer', desc: 'Block explorer for the 0G Chain.', url: 'https://chainscan.0g.ai', tags: ['Explorer'], icon: LinkIcon },
  { name: 'StorageScan', desc: 'Explore files stored on 0G Storage.', url: 'https://storagescan.0g.ai', tags: ['Storage'], icon: Database },
  { name: '0G Hub', desc: 'Discover dApps built on 0G Network.', url: 'https://hub.0g.ai', tags: ['DeFi', 'Hub'], icon: Globe },
  { name: '0G Documentation', desc: 'Official developer docs and guides.', url: 'https://docs.0g.ai', tags: ['Docs'], icon: BookOpen },
  { name: '0G Bridge', desc: 'Bridge assets to and from 0G Chain.', url: 'https://hub.0g.ai', tags: ['Bridge', 'DeFi'], icon: ArrowRightLeft },
  { name: 'Gimo Finance', desc: 'Stake & earn on 0G Network.', url: 'https://hub.0g.ai/discover', tags: ['DeFi'], icon: Coins },
];

export default function ExploreView() {
  return (
    <div className="fade-up tab-panel">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Explore Ecosystem</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>Discover dApps, tools, and services natively built on the 0G Network.</p>
      </div>
      <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {ECOSYSTEM.map(item => {
          const Icon = item.icon;
          return (
            <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{
              padding: 24, transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 14, textDecoration: 'none'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' 
                }}>
                  <Icon size={24} />
                </div>
                <ExternalLink size={16} style={{ color: 'var(--text-faint)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>{item.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 16 }}>
                {item.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, padding: '4px 12px', borderRadius: 20,
                    background: 'var(--accent-glow)', color: 'var(--accent)',
                    fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase'
                  }}>{tag}</span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
