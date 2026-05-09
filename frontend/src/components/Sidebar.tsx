import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { Tab } from '@/lib/types';
import { 
  Home, 
  LayoutGrid, 
  Compass, 
  User, 
  Info, 
  Moon, 
  Sun, 
  X, 
  Zap, 
  ExternalLink 
} from 'lucide-react';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'home',    label: 'Home',        icon: Home },
  { key: 'feed',    label: 'Global Feed', icon: LayoutGrid },
  { key: 'explore', label: 'Explore',     icon: Compass },
  { key: 'profile', label: 'My Profile',  icon: User },
  { key: 'about',   label: 'About',       icon: Info },
];

export default function Sidebar({
  activeTab, setActiveTab, total, isConnected, isWrongNetwork,
  onSwitchChain, address, isOpen, onClose,
  onConnect, onDisconnect, theme, onToggleTheme,
}: {
  activeTab: Tab; setActiveTab: (t: Tab) => void;
  total: bigint; isConnected: boolean; isWrongNetwork: boolean;
  onSwitchChain: () => void; address?: string;
  isOpen: boolean; onClose: () => void;
  onConnect?: () => void; onDisconnect?: () => void;
  theme: 'dark' | 'light'; onToggleTheme: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [optimisticTab, setOptimisticTab] = useState<Tab>(activeTab);

  useEffect(() => {
    setOptimisticTab(activeTab);
  }, [activeTab]);

  const short = (a: string) => `${a.slice(0, 6)}···${a.slice(-4)}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)', zIndex: 998,
        }} />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} style={{ zIndex: 999 }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <Link href="/" onClick={() => { setOptimisticTab('home'); setActiveTab('home'); onClose(); }} className="sidebar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
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

          <div className="mobile-only">
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-menu-label">Menu</div>
          {TABS.map(t => {
            const active = mounted && optimisticTab === t.key;
            const Icon = t.icon;
            const href = t.key === 'profile'
              ? (mounted && address ? `/profile/${address}` : undefined)
              : (t.key === 'home' ? '/' : `/?tab=${t.key}`);
            
            const tabClassName = `sidebar-tab ${active ? 'sidebar-tab-active' : ''}`;

            const content = (
              <>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ 
                  color: active ? 'var(--accent)' : 'var(--text-faint)',
                  transition: 'all 0.2s'
                }} />
                <span style={{ fontWeight: active ? 700 : 500 }}>{t.label}</span>
              </>
            );

            if (href) {
              return (
                <Link
                  key={t.key}
                  href={href}
                  onClick={() => { 
                    setOptimisticTab(t.key);
                    // Only update parent state for non-profile tabs to avoid double-render flicker
                    // Profile is a separate route that handles its own state
                    if (t.key !== 'profile') {
                      setActiveTab(t.key);
                    }
                    onClose(); 
                  }}
                  className={tabClassName}
                  style={{ textDecoration: 'none' }}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={t.key}
                onClick={() => { 
                  setOptimisticTab(t.key);
                  setActiveTab(t.key); 
                  onClose(); 
                }}
                className={tabClassName}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* Wrong network alert */}
        {isWrongNetwork && (
          <button onClick={onSwitchChain} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            color: 'var(--error)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12
          }}>
            <Zap size={14} fill="currentColor" /> Switch to 0G Mainnet
          </button>
        )}

        {/* Stats widget */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '16px 16px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                0G Network
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', display: 'block',
                  background: isWrongNetwork ? 'var(--error)' : 'var(--success)',
                }} className={isWrongNetwork ? '' : 'pulse-dot'} />
                <span style={{ fontSize: 10, fontWeight: 700, color: isWrongNetwork ? 'var(--error)' : 'var(--success)' }}>
                  {isWrongNetwork ? 'Wrong' : 'Live'}
                </span>
              </div>
            </div>

            {[
              { l: 'Chain ID',    v: '16661',          c: 'var(--accent)',  mono: true },
              { l: 'Total Posts', v: total.toString(), c: 'var(--text)',    mono: false },
              { l: 'Storage',     v: '0G Turbo',       c: 'var(--accent2)', mono: false },
            ].map(i => (
              <div key={i.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{i.l}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: i.c, fontFamily: i.mono ? 'monospace' : 'inherit' }}>{i.v}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                { label: 'ChainScan', url: `https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}` },
                { label: 'StorageScan', url: 'https://storagescan.0g.ai' },
              ].map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" style={{
                  fontSize: 11, color: 'var(--accent)', fontWeight: 700,
                  padding: '5px 10px', borderRadius: 6,
                  background: 'rgba(109,67,242,0.07)',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(109,67,242,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(109,67,242,0.07)'}
                >
                  {link.label}
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          </div>

          {/* Wallet section */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mounted && isConnected ? (
              <>
                <div style={{
                  padding: '9px 14px', borderRadius: 10,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  fontSize: 12, fontWeight: 600, color: 'var(--text)',
                  fontFamily: 'monospace', textAlign: 'center',
                }}>{address ? short(address) : ''}</div>
                <button onClick={onDisconnect} style={{
                  padding: '9px 14px', borderRadius: 10,
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>Disconnect</button>
              </>
            ) : (
              <button onClick={onConnect} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                border: 'none', color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(109,67,242,0.3)',
              }}>Connect Wallet</button>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
