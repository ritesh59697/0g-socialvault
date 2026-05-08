'use client';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

export default function Footer() {
  return (
    <footer style={{ 
      marginTop: 'auto', 
      padding: '48px 24px', 
      borderTop: '1px solid var(--border)',
      background: 'var(--bg)',
      textAlign: 'center'
    }}>
      <div className="app-rail">
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--text-faint)',
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16
        }}>
          Built for <span style={{ color: 'var(--accent)', fontWeight: 800 }}>0G APAC Hackathon</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <a
            href="https://x.com/Ritesh5969"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
              padding: '8px 16px', borderRadius: 20, background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', transition: 'all 0.2s'
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <img
              src="https://pbs.twimg.com/profile_images/1944572785373728768/Qc4iOnla_400x400.jpg"
              alt="Ritesh5969"
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
              Built by <span style={{ color: 'var(--accent)' }}>Ritesh5969</span>
            </div>
          </a>
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: 'var(--text-faint)' }}>
          © 2024 SocialVault • Secured by 0G Network
        </div>
      </div>
    </footer>
  );
}
