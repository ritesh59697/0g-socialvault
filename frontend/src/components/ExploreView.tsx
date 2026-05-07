'use client';

const ECOSYSTEM = [
  { name: 'ChainScan Explorer', desc: 'Block explorer for the 0G Chain.', url: 'https://chainscan.0g.ai', tags: ['Explorer'], icon: '⛓️' },
  { name: 'StorageScan', desc: 'Explore files stored on 0G Storage.', url: 'https://storagescan.0g.ai', tags: ['Storage'], icon: '📦' },
  { name: '0G Hub', desc: 'Discover dApps built on 0G Network.', url: 'https://hub.0g.ai', tags: ['DeFi', 'Hub'], icon: '🌐' },
  { name: '0G Documentation', desc: 'Official developer docs and guides.', url: 'https://docs.0g.ai', tags: ['Docs'], icon: '📖' },
  { name: '0G Bridge', desc: 'Bridge assets to and from 0G Chain.', url: 'https://hub.0g.ai', tags: ['Bridge', 'DeFi'], icon: '🌉' },
  { name: 'Gimo Finance', desc: 'Stake & earn on 0G Network.', url: 'https://hub.0g.ai/discover', tags: ['DeFi'], icon: '💰' },
];

export default function ExploreView() {
  return (
    <div className="fade-up tab-panel">
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Explore Ecosystem</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Discover dApps, tools, and services natively built on the 0G Network.</p>
      </div>
      <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {ECOSYSTEM.map(item => (
          <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="glass-panel" style={{
            padding: 24, transition: 'all 0.3s ease', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 32, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>{item.icon}</span>
              <span style={{ fontSize: 16, color: 'var(--text-faint)' }}>↗</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{item.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 16 }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20,
                  background: 'var(--accent-glow)', color: 'var(--accent)',
                  fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase'
                }}>{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
