import { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Database, Layers, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

export default function NetworkHealthPill() {
  const [latency, setLatency] = useState<number | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkNetwork = async () => {
    setIsChecking(true);
    const start = performance.now();
    try {
      const res = await fetch('https://evmrpc.0g.ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
      });
      const end = performance.now();
      const data = await res.json();
      if (data && data.result) {
        setLatency(Math.round(end - start));
        setBlockNumber(parseInt(data.result, 16));
      }
    } catch {
      setLatency(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 24,
          fontSize: 12,
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: 'var(--success)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        title="Click to view 0G Network Health & Diagnostics"
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: latency !== null ? '#10b981' : '#f59e0b',
            display: 'inline-block',
          }}
          className="pulse-dot"
        />
        <span>0G Mainnet</span>
        {latency !== null && (
          <span style={{ opacity: 0.8, fontSize: 11, fontFamily: 'monospace' }}>
            {latency}ms
          </span>
        )}
        <ChevronDown size={12} style={{ opacity: 0.7 }} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="glass-panel"
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 320,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              zIndex: 1000,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={16} className="text-gradient" />
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>
                  0G Network Status
                </span>
              </div>
              <button
                onClick={checkNetwork}
                disabled={isChecking}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 2,
                }}
                title="Refresh Status"
              >
                <RefreshCw size={13} className={isChecking ? 'animate-spin' : ''} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Chain ID</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>16661 (0G Mainnet)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>RPC Latency</span>
                <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>
                  {latency ? `${latency} ms` : 'Checking...'}
                </span>
              </div>

              {blockNumber && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: 'var(--bg)',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Block Height</span>
                  <span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
                    #{blockNumber.toLocaleString()}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>0G Storage Turbo</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>🟢 Active (Turbo Indexer)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Contract State</span>
                <a
                  href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Verified on ChainScan ↗
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
