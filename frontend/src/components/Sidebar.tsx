import Link from 'next/link';

type Tab = 'feed' | 'explore' | 'profile' | 'about';

export default function Sidebar({
  activeTab, setActiveTab, total, isConnected, isWrongNetwork, onSwitchChain, address,
}: {
  activeTab: Tab; setActiveTab: (t: Tab) => void;
  total: bigint; isConnected: boolean; isWrongNetwork: boolean;
  onSwitchChain: () => void;
  address?: string;
}) {
  const tabs: { key: Tab; label: string; icon: string; href?: string }[] = [
    { key: 'feed', label: 'Global Feed', icon: '📰', href: '/' },
    { key: 'explore', label: 'Explore', icon: '🧭', href: '/?tab=explore' },
    { key: 'profile', label: 'My Profile', icon: '👤', href: address ? `/profile/${address}` : undefined },
    { key: 'about', label: 'About', icon: '✨', href: '/?tab=about' },
  ];

  const valStyle = (c: string) => ({ fontSize: 13, fontWeight: 600 as const, color: c });

  return (
    <aside className="sidebar">
      {/* Brand / Logo */}
      <Link href="/" className="sidebar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <svg width="150" height="32" viewBox="0 0 160 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <polygon points="17,3 29,10 29,24 17,31 5,24 5,10" fill="url(#logoGrad)" opacity="0.15" stroke="url(#logoGrad)" strokeWidth="1.5" />
          <circle cx="17" cy="17" r="4" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" />
          <line x1="17" y1="10" x2="17" y2="13" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="17" y1="21" x2="17" y2="24" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="10" y1="17" x2="13" y2="17" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="21" y1="17" x2="24" y2="17" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="12" y1="12" x2="14.1" y2="14.1" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="19.9" y1="19.9" x2="22" y2="22" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="22" y1="12" x2="19.9" y2="14.1" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <line x1="14.1" y1="19.9" x2="12" y2="22" stroke="url(#logoGrad)" strokeWidth="1.2" />
          <circle cx="17" cy="1" r="1.5" fill="#8b5cf6" opacity="0.8" />
          <circle cx="17" cy="33" r="1.5" fill="#06b6d4" opacity="0.8" />
          <circle cx="3" cy="9" r="1.5" fill="#8b5cf6" opacity="0.8" />
          <circle cx="31" cy="9" r="1.5" fill="#06b6d4" opacity="0.8" />
          <circle cx="3" cy="25" r="1.5" fill="#8b5cf6" opacity="0.8" />
          <circle cx="31" cy="25" r="1.5" fill="#06b6d4" opacity="0.8" />
          <text x="39" y="23" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="18" fill="currentColor">Social</text>
          <text x="96" y="23" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="18" fill="url(#textGrad)">Vault</text>
        </svg>
      </Link>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-menu-label">Menu</div>
        {tabs.map(t => {
          const active = activeTab === t.key;
          const content = (
            <>
              <span style={{ fontSize: 18, filter: active ? 'none' : 'grayscale(100%) opacity(0.6)' }}>{t.icon}</span>
              {t.label}
            </>
          );

          if (t.href) {
            return (
              <Link 
                key={t.key} 
                href={t.href} 
                onClick={() => setActiveTab(t.key)}
                className={`sidebar-tab ${active ? 'sidebar-tab-active' : ''}`} 
                style={{ textDecoration: 'none' }}
              >
                {content}
              </Link>
            );
          }

          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`sidebar-tab ${active ? 'sidebar-tab-active' : ''}`}>
              {content}
            </button>
          );
        })}
      </nav>

      {/* Network Stats Widget */}
      <div className="glass-panel sidebar-stats" style={{ padding: 20, border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent2)' }}>⚡</span> Network Stats
        </div>
        {[
          { l: 'Chain', v: '0G Mainnet', c: 'var(--success)' },
          { l: 'Total Posts', v: total.toString(), c: 'var(--accent)' },
          { l: 'Storage', v: '0G Turbo', c: 'var(--text-muted)' },
        ].map(i => (
          <div key={i.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>{i.l}</span>
            <span style={valStyle(i.c)}>{i.v}</span>
          </div>
        ))}
      </div>

      {/* Footer Credit */}
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text-faint)',
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
          textAlign: 'center'
        }}>
          Built for <span style={{ color: 'var(--accent)', fontWeight: 800 }}>0G APAC Hackathon</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <a
            href="https://x.com/Ritesh5969"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <img
              src="https://pbs.twimg.com/profile_images/1944572785373728768/Qc4iOnla_400x400.jpg"
              alt="Ritesh5969"
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
            />
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1.2 }}>
              Built by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Ritesh5969</span>
            </div>
          </a>
        </div>
      </div>
    </aside>
  );
}
