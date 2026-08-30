'use client';
import { useState, useEffect } from 'react';
import {
  Zap, ShieldCheck, Wallet, Play, Server, Terminal,
  ExternalLink, User, Sparkles, Rocket, BarChart3,
  Globe, Cpu, Layers, FileCode, CheckCircle2,
  Lock, RefreshCw, ArrowRight, Database, Coins, Heart
} from 'lucide-react';
import { Tab } from '@/lib/types';
import { SOCIALVAULT_ADDRESS } from '@/lib/contract';
import ProfileAvatar from '@/components/ProfileAvatar';

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
  const [sandboxStep, setSandboxStep] = useState<number>(0);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [mockRootHash, setMockRootHash] = useState('0x7f4b89e21d34c901aa884e92b342cf12e098a5410972b981cfda5523a1e948c2');

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
    
    // Step 1: Ingestion
    setSandboxStep(1);
    setSandboxLogs([`[0G-SDK] INITIALIZING: Ingesting "${sandboxFile}" (1.24 MB)`]);
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 2: Slicing & Merkle Hashing
    setSandboxStep(2);
    setSandboxLogs(prev => [
      ...prev,
      `[0G-STORAGE] ERASURE CODING: 4 Data + 2 Parity segments created.`,
      `[0G-STORAGE] MERKLE TREE: Computing 256KB segment hashes client-side...`
    ]);
    await new Promise(r => setTimeout(r, 1200));
    
    // Step 3: Sharding to 0G Turbo Indexer
    const generatedHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setMockRootHash(generatedHash);
    setSandboxStep(3);
    setSandboxLogs(prev => [
      ...prev,
      `[0G-MERKLE] ROOT COMPUTED: ${generatedHash.slice(0, 18)}...`,
      `[0G-INDEXER] BROADCAST: Uploading segments to Turbo Node storage...`,
      `[0G-INDEXER] STATUS: Blob committed with Merkle proof confirmation.`
    ]);
    await new Promise(r => setTimeout(r, 1200));

    // Step 4: Anchoring on 0G Chain
    setSandboxStep(4);
    setSandboxLogs(prev => [
      ...prev,
      `[0G-CHAIN] TRANSACTION: Calling SocialVault.createPost() on ChainID 16661...`,
    ]);
    await new Promise(r => setTimeout(r, 1100));

    // Step 5: Completed
    setSandboxStep(5);
    setSandboxLogs(prev => [
      ...prev,
      `[0G-CONSENSUS] CONFIRMED: Post anchored on-chain. Storage proof verifiable on StorageScan.`
    ]);
    setIsSimulating(false);
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  return (
    <div className="fade-up" style={{ paddingTop: 20, paddingBottom: 60, position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Background Ambience */}
      <div className="grid-pattern" />

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="app-rail" style={{ position: 'relative', paddingTop: isMobile ? 30 : 50, paddingBottom: 60, zIndex: 1 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            marginBottom: 24, background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--success)'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} className="pulse-dot" />
            <span>0G Mainnet (Chain ID 16661) · Zero Centralized Servers</span>
          </div>

          {/* Clean Editorial Headline */}
          <h1 style={{
            fontSize: isMobile ? '34px' : 'clamp(44px, 5vw, 62px)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.035em',
            marginBottom: 20,
            color: 'var(--text)',
          }}>
            Decentralized SocialFi. <br className="desktop-only" />
            <span style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Anchored on 0G.
            </span>
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '18px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: 640,
            margin: '0 auto 36px',
            fontWeight: 500
          }}>
            A sovereign social protocol where your posts, rich media, and creator graph are cryptographically 
            committed to <strong>0G Storage Turbo nodes</strong> and settled directly on <strong>0G Chain</strong>.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            <button
              onClick={() => onNavigate('feed')}
              className="primary-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 24, fontSize: 15, fontWeight: 800
              }}
            >
              <Rocket size={18} /> Launch Social Feed <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('sandbox-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="secondary-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 24, fontSize: 15, fontWeight: 700
              }}
            >
              <Terminal size={17} /> 0G Storage Sandbox
            </button>

            <a
              href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '14px 24px', borderRadius: 24, fontSize: 14, fontWeight: 700,
                textDecoration: 'none', color: 'var(--text-muted)'
              }}
            >
              <ExternalLink size={15} /> 0G Contract
            </a>
          </div>

          {/* ── LIVE INTERFACE PREVIEW CARD ── */}
          <div
            className="glass-card"
            style={{
              maxWidth: 680,
              margin: '0 auto',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: 24,
              textAlign: 'left',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  0G
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                      0x2d77...c0f3
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        padding: '2px 6px',
                        borderRadius: 10,
                        fontWeight: 800,
                      }}
                    >
                      Verified Creator
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Anchored via 0G Turbo Node · 4m ago
                  </div>
                </div>
              </div>

              <a
                href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                0G ChainScan <ExternalLink size={12} />
              </a>
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', margin: '0 0 16px' }}>
              Just published our autonomous agent state to 0G Permanent Storage! Media segments are Merkle-verified on 0G Storage Turbo with instant on-chain royalties. 🚀
            </p>

            {/* Proof pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                fontSize: 12,
                fontFamily: 'monospace',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>0G Merkle Root: 0x7f4b...48c2</span>
              </div>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: 11 }}>
                🟢 Merkle-Verified
              </span>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => onNavigate('feed')}
                  className="secondary-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700 }}
                >
                  <Heart size={14} color="#ef4444" fill="#ef4444" /> 24 Likes
                </button>
                <button
                  onClick={() => onNavigate('feed')}
                  className="primary-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700 }}
                >
                  <Zap size={14} /> Tip Creator (0.01 0G)
                </button>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'monospace' }}>Post #9</span>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: 12,
              marginTop: 40,
            }}
          >
            {[
              { label: '0G Mainnet', value: 'Chain ID 16661' },
              { label: 'Storage Layer', value: '0G Turbo Nodes' },
              { label: 'Blob Segmenting', value: '256 KB Merkle' },
              { label: 'Platform Fees', value: '98% to Creator' },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 4 }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── LIVE INTERACTIVE SANDBOX WIDGET ─────────────────────── */}
      <section id="sandbox-section" className="app-rail" style={{ marginBottom: 70, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            Interactive Demo
          </div>
          <h2 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            0G Storage Engine Simulator
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6, maxWidth: 520, margin: '6px auto 0' }}>
            Simulate how files are chunked into 256KB segments, Merklized, and anchored to 0G nodes.
          </p>
        </div>

        <div className="glass-panel" style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1.2fr 1fr',
          gap: 24,
          padding: isMobile ? 18 : 28,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
        }}>
          {/* Left panel: Simulator Output logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Terminal size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                  0G Storage Ingestion Console
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
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 18,
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
                  <Terminal size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                  <div>Select a file below and click <strong>Simulate Ingestion</strong>.</div>
                </div>
              ) : (
                sandboxLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes('CONFIRMED') ? 'var(--success)' : log.includes('MERKLE') ? 'var(--accent)' : '#a1a1aa', lineHeight: 1.5, wordBreak: 'break-all' }}>
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Sandbox controller */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={sandboxFile}
                onChange={e => setSandboxFile(e.target.value)}
                disabled={isSimulating}
                style={{
                  background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)',
                  padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, outline: 'none',
                  flex: 1, minWidth: 150
                }}
              >
                <option value="agentic_prompt.json">🤖 agentic_prompt.json (1.24 MB)</option>
                <option value="avatar_vector.png">🖼️ avatar_vector.png (4.10 MB)</option>
                <option value="post_metadata.json">📄 post_metadata.json (12 KB)</option>
              </select>

              <button
                onClick={runSandboxSimulation}
                disabled={isSimulating}
                className="primary-btn"
                style={{
                  padding: '10px 22px', borderRadius: 12, display: 'flex', alignItems: 'center',
                  gap: 8, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap'
                }}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Ingesting...
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" /> Simulate Ingestion
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: Merkle Tree visualization */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 16, padding: 18,
            background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Merkle Tree & Segment Verification
            </div>

            {/* Tree visualization */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', gap: 16, minHeight: 180 }}>
              {/* Root Node */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 11, fontFamily: 'monospace',
                  background: sandboxStep >= 3 ? 'var(--accent)' : 'var(--surface)',
                  color: sandboxStep >= 3 ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 3 ? 'var(--accent)' : 'var(--border)'}`,
                  boxShadow: sandboxStep >= 3 ? '0 0 15px var(--accent-glow)' : 'none',
                  transition: 'all 0.4s ease', fontWeight: 800
                }}>
                  {sandboxStep >= 3 ? 'Root: ' + mockRootHash.slice(0, 12) + '...' : '0G Merkle Root'}
                </div>
              </div>

              {/* Branch Nodes */}
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{
                  padding: '6px 12px', borderRadius: 14, fontSize: 10, fontFamily: 'monospace',
                  background: sandboxStep >= 2 ? 'rgba(6, 182, 212, 0.15)' : 'var(--surface)',
                  color: sandboxStep >= 2 ? 'var(--accent2)' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 2 ? 'var(--accent2)' : 'var(--border)'}`,
                  fontWeight: 700
                }}>
                  Branch L1
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: 14, fontSize: 10, fontFamily: 'monospace',
                  background: sandboxStep >= 2 ? 'rgba(6, 182, 212, 0.15)' : 'var(--surface)',
                  color: sandboxStep >= 2 ? 'var(--accent2)' : 'var(--text-muted)',
                  border: `1px solid ${sandboxStep >= 2 ? 'var(--accent2)' : 'var(--border)'}`,
                  fontWeight: 700
                }}>
                  Branch R1
                </div>
              </div>

              {/* Leaf Nodes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                {['Chunk 1', 'Chunk 2', 'Chunk 3', 'Chunk 4'].map((leaf, idx) => {
                  const active = sandboxStep >= 2;
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 9, textAlign: 'center', fontFamily: 'monospace',
                        background: active ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                        color: active ? 'var(--success)' : 'var(--text-faint)',
                        border: `1px solid ${active ? 'var(--success)' : 'var(--border)'}`,
                        fontWeight: 700
                      }}
                    >
                      {leaf}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS ────────────────────────────────────────── */}
      <section className="app-rail" style={{ marginBottom: 70 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
            Architecture
          </div>
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
            The 0G Modular Stack in Action
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: windowWidth > 900 ? 'repeat(3, 1fr)' : '1fr',
          gap: 18,
        }}>
          {/* Card 1: 0G Storage Sharding */}
          <div style={{
            gridColumn: windowWidth > 900 ? 'span 2' : 'span 1',
            padding: 28, borderRadius: 20, background: 'var(--surface)',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 16, fontSize: 10, background: 'rgba(6,182,212,0.1)', color: 'var(--accent2)', fontWeight: 800, marginBottom: 12 }}>
                0G Storage Turbo
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>
                Merkle-Verified Decentralized Blob Ingestion
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                All user media and metadata JSON blobs are encoded into 256KB segments and sharded across 0G Storage nodes. Direct Turbo indexer integration allows gasless, Merkle-verified uploads from any browser.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 18, flexWrap: 'wrap', fontSize: 11 }}>
              <span style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 6, color: 'var(--text-muted)' }}>@0gfoundation/0g-ts-sdk</span>
              <span style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 6, color: 'var(--text-muted)' }}>ZgBlob Processing</span>
              <span style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 6, color: 'var(--text-muted)' }}>StorageScan Explorer</span>
            </div>
          </div>

          {/* Card 2: 0G Chain Settlement */}
          <div style={{
            padding: 28, borderRadius: 20, background: 'var(--surface)',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 16, fontSize: 10, background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: 800, marginBottom: 12 }}>
                0G Chain (16661)
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>
                On-Chain Graph & Creator Tips
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                SocialVault.sol handles post pointers, like tallies, and direct-to-creator tipping in Native 0G and USDC with built-in royalty splits.
              </p>
            </div>
            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} /> Deployed on 0G Mainnet
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION ────────────────────────────────── */}
      <section className="app-rail" style={{ paddingBottom: 20 }}>
        <div style={{
          padding: '48px 32px',
          borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', margin: '0 0 12px' }}>
            Ready to Experience Sovereign Social on 0G?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 28px' }}>
            Connect your wallet to browse the live feed, post media, and inspect Merkle proofs on 0G Mainnet.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('feed')}
              className="primary-btn"
              style={{ padding: '12px 32px', borderRadius: 20, fontSize: 14, fontWeight: 800 }}
            >
              Open SocialVault Feed <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="secondary-btn"
              style={{ padding: '12px 24px', borderRadius: 20, fontSize: 14, fontWeight: 700 }}
            >
              Protocol Docs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
