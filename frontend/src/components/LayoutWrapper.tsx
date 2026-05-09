'use client';
import { Suspense } from 'react';
import AppShell from './AppShell';
import { Loader2 } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--accent)' }} />
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>SocialVault</div>
        </div>
      </div>
    }>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
