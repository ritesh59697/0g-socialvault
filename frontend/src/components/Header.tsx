import { useState } from 'react';
import { Sun, Moon, Menu, ShieldCheck, LogOut, Wallet, Award } from 'lucide-react';
import NetworkHealthPill from '@/components/NetworkHealthPill';
import JudgeGuideModal from '@/components/JudgeGuideModal';

type Tab = 'home' | 'feed' | 'explore' | 'profile' | 'about';

export default function Header({
  activeTab, address, isConnected, isWrongNetwork,
  onConnect, onDisconnect, onToggleSidebar,
  theme, onToggleTheme
}: {
  activeTab: Tab; address?: string; isConnected: boolean; isWrongNetwork: boolean;
  onConnect: () => void; onDisconnect: () => void; onToggleSidebar: () => void;
  theme: 'dark' | 'light'; onToggleTheme: () => void;
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'Welcome to SocialVault';
      case 'feed': return 'Global Feed';
      case 'explore': return 'Explore';
      case 'profile': return 'My Profile';
      case 'about': return 'About SocialVault';
      default: return 'Dashboard';
    }
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="app-rail app-header-inner mobile-header-grid">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              onClick={onToggleSidebar} 
              className="secondary-btn" 
              style={{ 
                width: 40, height: 40, borderRadius: 12, padding: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            
            {activeTab !== 'home' && (
              <h1 style={{ 
                fontSize: 16, 
                fontWeight: 700, 
                color: 'var(--text)', 
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                {getPageTitle()}
              </h1>
            )}
          </div>

          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button 
              onClick={() => setIsGuideOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: 10, padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
                color: 'var(--accent)', cursor: 'pointer'
              }}
              title="Judge Guide"
            >
              <Award size={18} />
            </button>
            <button 
              onClick={onToggleTheme} 
              style={{ 
                width: 36, height: 36, borderRadius: 10, padding: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: 'none',
                color: theme === 'dark' ? '#fbbf24' : '#ec4899',
              }}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
          
          <div className="header-actions desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Judge Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
                color: 'var(--accent)', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              title="Open Hackathon Judge & Evaluator Guide"
            >
              <Award size={15} />
              <span>Judge Guide</span>
            </button>

            {/* 0G Live Health Diagnostics */}
            <NetworkHealthPill />

            <button 
              onClick={onToggleTheme} 
              style={{
                width: 38, height: 38, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                padding: 0,
                color: theme === 'dark' ? '#fbbf24' : '#ec4899',
                transition: 'all 0.2s'
              }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>

            {isConnected && address ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="glass-panel" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', borderRadius: 20, fontSize: 13,
                  color: 'var(--text)', fontWeight: 600, boxShadow: 'none'
                }}>
                  <Wallet size={14} className="text-gradient" />
                  {short(address!)}
                </div>
                <button onClick={onDisconnect} className="secondary-btn" style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600
                }}>
                  <LogOut size={13} />
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={onConnect} className="primary-btn" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 20, fontSize: 13,
              }}>
                <Wallet size={15} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <JudgeGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </>
  );
}
