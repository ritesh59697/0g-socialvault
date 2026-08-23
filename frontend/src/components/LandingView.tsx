'use client';
import { useState, useEffect } from 'react';
import {
  Zap, ShieldCheck, Wallet, Play, Server, Terminal,
  ExternalLink, User, Sparkles, Rocket, BarChart3,
  Globe, Cpu, Layers, FileCode, CheckCircle2,
  Lock, RefreshCw, Star, Coins
} from 'lucide-react';
import { Tab } from '@/lib/types';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';

const ZERO_G_LOGO = "https://pbs.twimg.com/profile_images/2038084529374867456/Oq74BA_I_400x400.jpg";

export default function LandingView({
  onNavigate, onConnect, isConnected, address
}: {
  onNavigate: (tab: Tab) => void;
  onConnect: () => void;
  isConnected: boolean;
  address?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Sandbox simulation states
  const [sandboxFile, setSandboxFile] = useState('agentic_prompt.json');
  const [sandboxStep, setSandboxStep] = useState<number>(0); // 0: idle, 1: slicing, 2: hashing, 3: sharding, 4: anchoring, 5: complete
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mockRootHash, setMockRootHash] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const runSandboxSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    // Step 1: Erasure Coding
    setSandboxStep(1);
    setSandboxLogs([`[09:10:02] INITIALIZING UPLOAD: "${sandboxFile}" (1.24 MB)`]);
    await new Promise(r => setTimeout(r, 1200));
    
    // Step 2: Hashing Leaf Nodes
    setSandboxStep(2);
    setSandboxLogs(prev => [
      ...prev,
      `[09:10:03] ERASURE CODING: Generated 4 Data segments & 2 Parity segments.`,
      `[09:10:04] COMPUTING HASHES: Slicing file into Merkle leaf nodes...`
    ]);
    await new Promise(r => setTimeout(r, 1400));
    
    // Step 3: Sharding to 0G nodes
    const generatedHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setMockRootHash(generatedHash);
    setSandboxStep(3);
    setSandboxLogs(prev => [
      ...prev,
      `[09:10:05] MERKLE ROOT: Computed successfully -> ${generatedHash.slice(0, 18)}...`,
      `[09:10:06] BROADCASTING: Syncing shards to decentralized storage nodes...`,
      `[09:10:07] NODE STATUS: Shard D1-D4 anchored on Node #24 (Global Network)`
    ]);
    await new Promise(r => setTimeout(r, 1500));

    // Step 4: Anchoring contract
    setSandboxStep(4);
    setSandboxLogs(prev => [
      ...prev,
      `[09:10:08] CONSENSUS LAYER: Anchor request received for root hash.`,
      `[09:10:09] EVM TRANSACTION: Invoking createPost() on SocialVault.sol...`
    ]);
    await new Promise(r => setTimeout(r, 1400));

    // Step 5: Completed
    setSandboxStep(5);
    setSandboxLogs(prev => [
      ...prev,
      `[09:10:10] TRANSACTION CONFIRMED: 0G Chain block inclusion verified.`,
      `[09:10:11] DATA IMMUTABILITY SECURED: 100% fault tolerance established.`
    ]);
    setIsSimulating(false);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  return (
    <div className="fade-up" style={{ paddingTop: 40, paddingBottom: 20, position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Premium Cyber Grid Background */}
      <div className="grid-pattern" />

      {/* Hero Section (Wrapped in app-rail for perfect side alignment) */}
      <section className="app-rail" style={{ position: 'relative', paddingTop: isMobile ? 40 : 60, paddingBottom: isMobile ? 40 : 60, textAlign: 'center', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Premium Hackathon Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 20, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
            marginBottom: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            textTransform: 'uppercase', letterSpacing: 1
          }}>
            <img src={ZERO_G_LOGO} alt="0G" style={{ width: 16, height: 16, borderRadius: '50%' }} /> 
            0G Native SocialFi & Sovereign Agents
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : 'clamp(42px, 5.5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            color: 'var(--text)',
            maxWidth: 800
          }}>
            Own Your Identity. <span className="text-gradient">Secured by 0G Permanent Storage.</span>
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '17px',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            maxWidth: 680,
            marginBottom: 38,
            fontWeight: 500
          }}>
            SocialVault is the sovereign social protocol built on 0G. Secure your media assets, 
            tokenize your system prompt state into ERC-7857 Agentic IDs, and tip creators in stablecoins 
            with zero platform friction.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
            <button
              onClick={() => onNavigate('feed')}
              className="primary-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 32, fontSize: 15, fontWeight: 800 }}
            >
              <Rocket size={18} /> Launch Social Vault
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="secondary-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 32, fontSize: 15, fontWeight: 800, background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <BarChart3 size={18} /> Creator Dashboard
            </button>
            {mounted && !isConnected && (
              <button
                onClick={onConnect}
                className="secondary-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 32, fontSize: 15, fontWeight: 800, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)' }}
              >
                <Wallet size={18} /> Connect Wallet
              </button>
            )}
          </div>

          {/* Unified Micro Stats Pill */}
          <div style={{
            display: 'inline-flex', justifyContent: 'center', flexWrap: 'wrap', 
            gap: isMobile ? 20 : 40, opacity: 0.95,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24, padding: isMobile ? '12px 20px' : '16px 36px',
            marginTop: 36, backdropFilter: 'blur(8px)'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={16} className="text-gradient" /> 100%
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, fontWeight: 700 }}>Data Sovereignty</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)', display: isMobile ? 'none' : 'block', alignSelf: 'center' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={16} className="text-gradient" /> ERC-7857
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, fontWeight: 700 }}>Agentic ID Standard</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border)', display: isMobile ? 'none' : 'block', alignSelf: 'center' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={16} className="text-gradient" /> 0G Pay
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, fontWeight: 700 }}>Stablecoin Tipping</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── LIVE INTERACTIVE SANDBOX WIDGET ─────────────────────── */}
      <section className="app-rail" style={{ marginBottom: 72, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>Try It Out</div>
          <h2 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            0G Storage Engine Sandbox
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8, maxWidth: 500, margin: '8px auto 0' }}>
            Simulate a real-time upload to see erasure coding, sharding, and smart contract anchoring in action.
          </p>
        </div>

        <div className="glass-panel" style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1.2fr 1fr',
          gap: 24,
          padding: isMobile ? 18 : 32,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Left panel: Simulator Output logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={16} style={{ color: 'var(--accent2)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                  0G Node Upload Console
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              </div>
            </div>

            <div style={{
              background: '#09090d',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.05)',
              padding: 20,
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#d4d4d8',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)',
              overflowY: 'auto'
            }}>
              {sandboxLogs.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-faint)' }}>
                  <Terminal size={24} style={{ marginBottom: 10, opacity: 0.5 }} />
                  <div>Select a file type below and start the simulation.</div>
                </div>
              ) : (
                sandboxLogs.map((log, idx) => {
                  let color = '#a1a1aa';
                  if (log.includes('SYSTEM')) color = 'var(--accent)';
                  else if (log.includes('ENCODER')) color = 'var(--accent2)';
                  else if (log.includes('STORAGE')) color = '#fbbf24';
                  else if (log.includes('COMPLETE') || log.includes('VERIFIED')) color = 'var(--success)';
                  return (
                    <div key={idx} style={{ color, lineHeight: 1.5, wordBreak: 'break-all' }}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>

            {/* Sandbox controller */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={sandboxFile}
                onChange={e => setSandboxFile(e.target.value)}
                disabled={isSimulating}
                style={{
                  background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
                  padding: '12px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, outline: 'none',
                  flex: 1, minWidth: 150
                }}
              >
                <option value="agentic_prompt.json">🤖 agentic_prompt.json (1.24 MB)</option>
                <option value="prompt_override.txt">📝 prompt_override.txt (28 KB)</option>
                <option value="avatar_vector.png">🖼️ avatar_vector.png (4.10 MB)</option>
                <option value="model_weights.bin">🧬 model_weights.bin (28.4 MB)</option>
              </select>

              <button
                onClick={runSandboxSimulation}
                disabled={isSimulating}
                className="primary-btn"
                style={{
                  padding: '12px 24px', borderRadius: 12, display: 'flex', alignItems: 'center',
                  gap: 8, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap'
                }}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Simulating...
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" /> Simulate Upload
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: Slicing / Merkle Tree diagram animation */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 18, padding: 20,
            background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Visualizing Merkle Tree & Shards
            </div>

            {/* Tree visualization */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', gap: 20, minHeight: 200 }}>
              {/* Root Node */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 10, fontFamily: 'monospace',
                  background: sandboxStep >= 3 ? 'var(--accent)' : 'var(--surface)',
                  color: sandboxStep >= 3 ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 3 ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: sandboxStep >= 3 ? '0 0 15px var(--accent-glow)' : 'none',
                  transition: 'all 0.5s ease', fontWeight: 800
                }}>
                  {sandboxStep >= 3 ? 'Root: ' + mockRootHash.slice(0, 10) + '...' : 'Merkle Root'}
                </div>
              </div>

              {/* Branch Nodes */}
              <div style={{ display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
                <div style={{
                  padding: '6px 14px', borderRadius: 16, fontSize: 9, fontFamily: 'monospace',
                  background: sandboxStep >= 2 ? 'rgba(6, 182, 212, 0.2)' : 'var(--surface)',
                  color: sandboxStep >= 2 ? 'var(--accent2)' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 2 ? 'var(--accent2)' : 'var(--border)'}`,
                  transition: 'all 0.5s ease', fontWeight: 700
                }}>
                  Hash L12
                </div>
                <div style={{
                  padding: '6px 14px', borderRadius: 16, fontSize: 9, fontFamily: 'monospace',
                  background: sandboxStep >= 2 ? 'rgba(6, 182, 212, 0.2)' : 'var(--surface)',
                  color: sandboxStep >= 2 ? 'var(--accent2)' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 2 ? 'var(--accent2)' : 'var(--border)'}`,
                  transition: 'all 0.5s ease', fontWeight: 700
                }}>
                  Hash R12
                </div>
              </div>

              {/* Leaf Nodes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                {['Leaf 1', 'Leaf 2', 'Leaf 3', 'Leaf 4'].map((leaf, idx) => {
                  const active = sandboxStep >= 2;
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 9, textAlign: 'center', fontFamily: 'monospace',
                        background: active ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                        color: active ? 'var(--success)' : 'var(--text-faint)',
                        border: `1px solid ${active ? 'var(--success)' : 'var(--border)'}`,
                        transition: 'all 0.4s ease', fontWeight: 700
                      }}
                    >
                      {leaf}
                    </div>
                  );
                })}
              </div>

              {/* Decentralized storage nodes strip */}
              <div style={{
                marginTop: 10, padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-faint)' }}>
                  <Server size={12} /> Target Shards
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['D1', 'D2', 'D3', 'D4', 'P1', 'P2'].map((shard, idx) => {
                    let bg = 'rgba(255,255,255,0.02)';
                    let border = 'rgba(255,255,255,0.05)';
                    let color = 'var(--text-faint)';
                    if (sandboxStep >= 3) {
                      bg = shard.startsWith('D') ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)';
                      border = shard.startsWith('D') ? 'rgba(99, 102, 241, 0.4)' : 'rgba(245, 158, 11, 0.4)';
                      color = shard.startsWith('D') ? '#818cf8' : '#fbbf24';
                    }
                    return (
                      <span key={idx} style={{
                        fontSize: 9, padding: '3px 6px', borderRadius: 4, fontWeight: 900,
                        background: bg, border: `1px solid ${border}`, color, transition: 'all 0.4s ease'
                      }}>
                        {shard}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ─────────────────────────────────── */}
      <section className="app-rail" style={{ marginBottom: 72, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>Platform Features</div>
          <h2 style={{ fontSize: isMobile ? '26px' : '34px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            Built Permanent. Governed Sovereign.
          </h2>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: windowWidth > 900 ? 'repeat(3, 1fr)' : '1fr',
          gap: 20,
        }}>
          {/* Card 1: Large Engine display (span-2) */}
          <div style={{
            gridColumn: windowWidth > 900 ? 'span 2' : 'span 1',
            padding: 32, borderRadius: 24, background: 'var(--surface)',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(6,182,212,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div>
              <div style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 10,
                background: 'rgba(6,182,212,0.1)', color: 'var(--accent2)', border: '1px solid rgba(6,182,212,0.2)',
                fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16
              }}>
                0G Storage
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
                High-Performance Sharding Architecture
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 480 }}>
                SocialVault breaks centralized database silos by sharding files into data blocks and parity blocks 
                across independent storage nodes. This ensures complete availability, immutable persistence, and near-zero fees.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-muted)', fontWeight: 600 }}>🗂️ merklized data structures</span>
              <span style={{ fontSize: 11, padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-muted)', fontWeight: 600 }}>⚡ 0G storage-turbo upload</span>
              <span style={{ fontSize: 11, padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-muted)', fontWeight: 600 }}>🔗 smart contract proofs</span>
            </div>
          </div>

          {/* Card 2: Agentic ID (span-1) */}
          <div style={{
            padding: 32, borderRadius: 24, background: 'var(--surface)',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(139,92,246,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div>
              <div style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 10,
                background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', border: '1px solid rgba(139,92,246,0.2)',
                fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16
              }}>
                ERC-7857 Standard
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
                Sovereign Agentic ID
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Secure your AI agent system prompt and persona state on-chain. Turn your social profile 
                into an autonomous agent profile that can receive commands, split royalties, and execute tipping actions.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={12} style={{ color: 'var(--success)' }} /> verified ERC-7857 integration
            </div>
          </div>

          {/* Card 3: 0G Pay Tipping (span-1) */}
          <div style={{
            padding: 32, borderRadius: 24, background: 'var(--surface)',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(16,185,129,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div>
              <div style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 10,
                background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.2)',
                fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16
              }}>
                0G Pay
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
                USDC Stablecoin Tipping
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Support creators using USD-pegged stablecoins. Avoid volatile gas fees and native asset 
                exposure. Includes 2% treasury contribution and 98% direct-to-creator splits.
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Coins size={12} style={{ color: 'var(--success)' }} /> 98% creator payout split
            </div>
          </div>

          {/* Card 4: Censorship Resistant (span-2) */}
          <div style={{
            gridColumn: windowWidth > 900 ? 'span 2' : 'span 1',
            padding: 32, borderRadius: 24, background: 'var(--surface)',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(236,72,153,0.05)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div>
              <div style={{
                display: 'inline-flex', padding: '4px 10px', borderRadius: 20, fontSize: 10,
                background: 'rgba(236,72,153,0.1)', color: 'var(--accent)', border: '1px solid rgba(236,72,153,0.2)',
                fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 16
              }}>
                Immutability
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
                True Censorship Resistance
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 500 }}>
                Your metadata, images, and videos are permanently anchored to the 0G Chain consensus. 
                Because there are no centralized platforms or gatekeepers, your digital footprint cannot be deleted, blocked, or altered.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-muted)', fontWeight: 600 }}>🛡️ decentralized consensus validation</span>
              <span style={{ fontSize: 11, padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 8, color: 'var(--text-muted)', fontWeight: 600 }}>💎 permanent Merkle proofs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="app-rail" style={{ marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>How it Works</div>
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            From Post to Permanent Record
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[
            { step: '01', icon: <Wallet size={20} />, title: 'Connect Wallet', desc: 'Use MetaMask or Rabby. The app auto-switches to 0G Mainnet (ChainID 16661).', color: '#8b5cf6' },
            { step: '02', icon: <Play size={20} />, title: 'Upload Media', desc: 'Write text or attach media (images or video, up to 50 MB) processed instantly.', color: '#06b6d4' },
            { step: '03', icon: <Server size={20} />, title: '0G Sharding', desc: 'Your files are sliced and sharded to storage nodes, yielding a unique Merkle root.', color: '#f59e0b' },
            { step: '04', icon: <ShieldCheck size={20} />, title: 'Onchain Anchor', desc: 'Merkle root proof is written to the SocialVault contract — permanent and unalterable.', color: '#10b981' },
          ].map((item, i) => {
            const isActive = activeStep === i;
            return (
              <div key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  padding: '24px',
                  background: isActive ? `${item.color}0d` : 'var(--surface)',
                  border: `1px solid ${isActive ? item.color + '44' : 'var(--border)'}`,
                  borderRadius: 20,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? `0 12px 32px ${item.color}12` : 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 180,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 900, fontFamily: 'monospace',
                    color: isActive ? item.color : 'var(--text-faint)',
                    letterSpacing: '0.05em',
                  }}>{item.step}</span>
                  <div style={{ color: isActive ? item.color : 'var(--text-faint)' }}>{item.icon}</div>
                </div>
                
                <div style={{ fontSize: 15, fontWeight: 800, color: isActive ? 'var(--text)' : 'var(--text-muted)', marginBottom: 8 }}>
                  {item.title}
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-faint)', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  {item.desc}
                </p>

                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: item.color,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
      <section className="app-rail" style={{ marginBottom: 72 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>Community Feedback</div>
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            Early Adopters Are Already Live
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { name: '0xf4a2…3e1b', note: 'Finally a social app where I actually own my posts. No more platform risk.' },
            { name: '0x8bc1…99da', note: 'Got tipped 2 USDC for my first post. Direct to wallet, no middleman.' },
            { name: '0x2d77…c0f3', note: 'Checked StorageScan — my image is actually on 0G nodes. This is real.' },
          ].map((proof, i) => (
            <div key={i} style={{
              padding: 22,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0, fontWeight: 900, fontSize: 12
                }}>0G</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>{proof.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>0G Mainnet user</div>
                </div>
                <Star size={14} style={{ marginLeft: 'auto', color: '#f59e0b' }} />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                "{proof.note}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="app-rail" style={{ paddingBottom: 20 }}>
        <div style={{
          padding: '60px 40px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.04) 50%, rgba(236,72,153,0.03) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontSize: 10, padding: '5px 14px', borderRadius: 999,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              color: 'var(--accent)', fontWeight: 800, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 20,
              display: 'inline-flex', alignItems: 'center', gap: 6
            }}>🏆 0G Bridge Hackathon · Wave 3</div>

            <h2 style={{
              fontSize: isMobile ? '26px' : '36px', fontWeight: 900,
              letterSpacing: '-0.03em', marginBottom: 16,
              background: 'linear-gradient(135deg, var(--text) 0%, var(--accent) 60%, var(--accent2) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Join the Social Layer for Web 4.0
            </h2>

            <p style={{
              fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65,
              maxWidth: 540, margin: '0 auto 36px',
            }}>
              Escape centralized silos. Secure your assets on the first high-performance social 
              network where you maintain complete digital ownership.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('feed')}
                style={{
                  padding: '14px 36px', borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(139,92,246,0.3)',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(139,92,246,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.3)'; }}
              >
                Start Posting to 0G <Zap size={14} fill="currentColor" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                style={{
                  padding: '14px 32px', borderRadius: 999,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
