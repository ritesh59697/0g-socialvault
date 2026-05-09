import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Tab } from '@/lib/types';


export default function Sidebar({
  activeTab, setActiveTab, total, isConnected, isWrongNetwork, onSwitchChain, address,
  isOpen, onClose, onConnect, onDisconnect,
  theme, onToggleTheme
}: {
  activeTab: Tab; setActiveTab: (t: Tab) => void;
  total: bigint; isConnected: boolean; isWrongNetwork: boolean;
  onSwitchChain: () => void;
  address?: string;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tabs: { key: Tab; label: string; icon: string; href?: string }[] = [
    { key: 'home', label: 'Home', icon: '🏠', href: '/?tab=home' },
    { key: 'feed', label: 'Global Feed', icon: '📰', href: '/?tab=feed' },
    { key: 'explore', label: 'Explore', icon: '🧭', href: '/?tab=explore' },
    { key: 'profile', label: 'My Profile', icon: '👤', href: (mounted && address) ? `/profile/${address}` : undefined },
    { key: 'about', label: 'About', icon: '✨', href: '/?tab=about' },
  ];

  const valStyle = (c: string) => ({ fontSize: 13, fontWeight: 600 as const, color: c });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
            zIndex: 998, backdropFilter: 'blur(4px)'
          }} 
          className="mobile-only"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand / Logo & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <Link href="/" className="sidebar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <svg width="130" height="28" viewBox="0 0 160 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>
              <polygon points="17,3 29,10 29,24 17,31 5,24 5,10" fill="url(#logoGrad)" opacity="0.15" stroke="url(#logoGrad)" strokeWidth="1.5" />
              <circle cx="17" cy="17" r="4" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" />
              <line x1="17" y1="10" x2="17" y2="13" stroke="url(#logoGrad)" strokeWidth="1.2" />
              <line x1="17" y1="21" x2="17" y2="24" stroke="url(#logoGrad)" strokeWidth="1.2" />
              <line x1="10" y1="17" x2="13" y2="17" stroke="url(#logoGrad)" strokeWidth="1.2" />
              <line x1="21" y1="17" x2="24" y2="17" stroke="url(#logoGrad)" strokeWidth="1.2" />
              <text x="39" y="23" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="18" fill="currentColor">Social</text>
              <text x="96" y="23" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="18" fill="url(#textGrad)">Vault</text>
            </svg>
          </Link>
          
          <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button onClick={onClose} className="secondary-btn" style={{ 
              width: 36, height: 36, borderRadius: 10, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border)'
            }}>✕</button>
            
            <button onClick={onToggleTheme} className="secondary-btn" style={{
              width: 36, height: 36, borderRadius: 10, padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border)'
            }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-menu-label">Menu</div>
          {tabs.map(t => {
            const active = activeTab === t.key;
            const content = (
              <>
                <span style={{ fontSize: 18, filter: active ? 'none' : 'grayscale(100%) opacity(0.6)' }}>{t.icon}</span>
                <span style={{ fontWeight: active ? 700 : 500 }}>{t.label}</span>
              </>
            );

            const tabClassName = `sidebar-tab ${active ? 'sidebar-tab-active' : ''}`;
            const tabStyle = active ? { 
              borderLeft: '4px solid var(--accent)',
              background: 'linear-gradient(90deg, var(--accent-glow), transparent)',
              paddingLeft: 12
            } : {};

            if (t.href) {
              return (
                <Link
                  key={t.key}
                  href={t.href}
                  onClick={() => setActiveTab(t.key)}
                  className={tabClassName}
                  style={{ textDecoration: 'none', ...tabStyle }}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={tabClassName} style={tabStyle}>
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

      {/* Mobile Wallet Section */}
      <div className="mobile-only" style={{ marginTop: 'auto', flexDirection: 'column', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        {isWrongNetwork && (
          <button onClick={onSwitchChain} className="primary-btn" style={{ width: '100%', background: 'var(--error)', fontSize: 13 }}>
            ⚠️ Switch to 0G Chain
          </button>
        )}
        
        {mounted && isConnected ? (
          <>
            <div className="glass-panel" style={{ padding: '10px', textAlign: 'center', fontSize: 12, fontWeight: 600, boxShadow: 'none' }}>
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </div>
            <button onClick={onDisconnect} className="secondary-btn" style={{ width: '100%', fontSize: 13 }}>
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button onClick={onConnect} className="primary-btn" style={{ width: '100%', fontSize: 14 }}>
            Connect Wallet
          </button>
        )}
      </div>

      </aside>
    </>
  );
}
