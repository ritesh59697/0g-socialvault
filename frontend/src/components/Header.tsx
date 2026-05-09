'use client';
import { useEffect, useState } from 'react';

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
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="app-rail app-header-inner mobile-header-grid">
        <button 
          onClick={onToggleSidebar} 
          className="secondary-btn mobile-only" 
          style={{ 
            width: 40, height: 40, borderRadius: 10, padding: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 
          }}
        >
          ☰
        </button>
        
        <h1 className="header-title" style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          color: 'var(--text)', 
          margin: 0,
          textAlign: 'center'
        }}>
          {getPageTitle()}
        </h1>

        <div className="mobile-only" style={{ width: 40 }} /> {/* Spacer to keep title centered */}
        
        <div className="header-actions desktop-only">
          <button onClick={onToggleTheme} className="secondary-btn desktop-only" style={{
            width: 38, height: 38, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)'
          }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="glass-panel desktop-only" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
            borderRadius: 24, fontSize: 13, fontWeight: 500,
            background: isWrongNetwork ? 'rgba(239,68,68,0.05)' : 'rgba(16,185,129,0.05)',
            border: `1px solid ${isWrongNetwork ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
            color: isWrongNetwork ? 'var(--error)' : 'var(--success)',
            boxShadow: 'none',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isWrongNetwork ? 'var(--error)' : 'var(--success)' }} className="pulse-dot" />
            {isWrongNetwork ? 'Wrong Network' : '0G Mainnet'}
          </div>

          {isConnected && address ? (
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="glass-panel" style={{
                padding: '8px 16px', borderRadius: 24, fontSize: 13,
                color: 'var(--text)', fontWeight: 500, boxShadow: 'none'
              }}>
                {short(address!)}
              </div>
              <button onClick={onDisconnect} className="secondary-btn" style={{
                padding: '8px 16px', borderRadius: 24, fontSize: 13,
              }}>Disconnect</button>
            </div>
          ) : (
            <button onClick={onConnect} className="primary-btn desktop-only" style={{
              padding: '9px 20px', borderRadius: 24, fontSize: 14,
            }}>Connect Wallet</button>
          )}
        </div>
      </div>
    </header>
  );
}
