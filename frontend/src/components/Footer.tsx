'use client';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '24px 16px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      textAlign: 'center'
    }}>
      <div className="app-rail">
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '6px'
        }}>
          <span>Built by</span>
          <a
            href="https://x.com/Ritesh5969"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            ritesh5969
          </a>
          <span>for</span>
          <a
            href="https://app.akindo.io/wave-hacks/Z4MlX4vreI72ol6pd"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent2)', fontWeight: 800, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >
            0G Bridge by AKINDO (Wave 3)
          </a>
        </div>
        
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-faint)' }}>
          © 2026 SocialVault • Secured by 0G Network
        </div>
      </div>
    </footer>
  );
}
