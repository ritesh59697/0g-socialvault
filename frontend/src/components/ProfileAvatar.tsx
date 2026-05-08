'use client';
import { useEffect, useState } from 'react';

function pick(addr: string, index: number) {
  return parseInt(addr.slice(2 + index * 2, 4 + index * 2), 16);
}

export default function ProfileAvatar({
  address,
  size = 40,
}: {
  address: string;
  size?: number;
}) {
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  
  useEffect(() => {
    const load = () => {
      if (address) {
        const saved = localStorage.getItem(`sv_avatar_${address.toLowerCase()}`);
        if (saved) {
          setCustomAvatar(saved);
          setImgError(false);
        } else {
          setCustomAvatar(null);
        }
      }
    };
    load();
    window.addEventListener('sv_profile_updated', load);
    return () => window.removeEventListener('sv_profile_updated', load);
  }, [address]);

  if (customAvatar && !imgError) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        border: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-secondary)'
      }}>
        <img 
          src={customAvatar} 
          alt="Avatar" 
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    );
  }

  const hueA = pick(address, 0) % 360;
  const hueB = (pick(address, 1) * 2) % 360;
  const hueC = (pick(address, 2) * 3) % 360;
  const tilt = (pick(address, 3) % 50) - 25;
  const dotX = 22 + (pick(address, 4) % 44);
  const dotY = 24 + (pick(address, 5) % 40);
  const barHeight = 18 + (pick(address, 6) % 24);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        background: `linear-gradient(145deg, hsl(${hueA} 78% 60%), hsl(${hueB} 72% 48%))`,
        boxShadow: `0 10px 24px hsla(${hueA} 80% 55% / 0.24)`,
        border: '1px solid rgba(255,255,255,0.16)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <linearGradient id={`avatar-grad-${address}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${hueC} 90% 84%)`} stopOpacity="0.95" />
            <stop offset="100%" stopColor={`hsl(${hueB} 82% 68%)`} stopOpacity="0.78" />
          </linearGradient>
        </defs>
        <rect
          x="12"
          y="18"
          width="62"
          height={barHeight}
          rx="14"
          fill={`url(#avatar-grad-${address})`}
          opacity="0.95"
          transform={`rotate(${tilt} 43 27)`}
        />
        <circle cx={dotX} cy={dotY} r="10" fill="rgba(255,255,255,0.88)" />
        <path
          d="M26 68C35 54 48 49 64 48C74 48 82 53 86 61C80 71 68 82 49 83C39 83 31 78 26 68Z"
          fill="rgba(13,18,32,0.22)"
        />
        <path
          d="M18 76C28 64 40 58 60 58C71 58 81 63 88 72"
          fill="none"
          stroke="rgba(255,255,255,0.78)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
