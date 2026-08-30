'use client';
import { useState, useEffect } from 'react';
import {
  Zap, ShieldCheck, Wallet, Play, Server, Terminal,
  ExternalLink, User, Sparkles, Rocket, BarChart3,
  Globe, Cpu, Layers, FileCode, CheckCircle2,
  Lock, RefreshCw, ArrowRight, Database, Coins, Heart,
  ChevronDown, ChevronUp, Check, DollarSign, Calculator, HelpCircle
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [storageSize, setStorageSize] = useState<number>(50); // MB
  const [tipCalcAmount, setTipCalcAmount] = useState<number>(50); // USDC

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqs = [
    {
      q: 'What is 0G Storage and how does it differ from IPFS or AWS S3?',
      a: 'Unlike centralized cloud storage (AWS S3) which can delete or censor your content, and unlike IPFS which requires centralized pinning services to prevent garbage collection, 0G Storage is a high-throughput, decentralized modular storage network. Content is erasure-coded, chunked into 256KB segments, Merklized, and distributed across decentralized Turbo nodes with cryptographic data availability proofs settled on-chain.'
    },
    {
      q: 'How does 0G Pay creator tipping work?',
      a: 'When you tip a post on SocialVault, you can tip with Native 0G tokens or USDC. The smart contract automatically splits the tip: 98% is transferred instantly to the creator wallet in the same transaction, while 2% goes to the community protocol treasury. There are zero intermediaries or monthly payout delays.'
    },
    {
      q: 'What is an ERC-7857 Agentic ID?',
      a: 'ERC-7857 is an intelligent data NFT standard. On SocialVault, creators and autonomous AI agents can mint an on-chain identity where system prompt states, behavioral personas, and memory hashes are anchored directly to 0G storage, allowing portable, verifiable AI identities.'
    },
    {
      q: 'How do I verify a post\'s Merkle root on StorageScan?',
      a: 'Every post card on SocialVault features an "Inspect 0G Proof" button. Clicking it displays the client-side computed Merkle Root Hash and JSON metadata hash, with a direct 1-click link to storagescan.0g.ai and 0G ChainScan.'
    },
    {
      q: 'Do I need gas tokens to upload media to 0G Storage?',
      a: 'SocialVault leverages 0G Storage Turbo indexer endpoints (https://indexer-storage-turbo.0g.ai) to process Merkle-verified blob uploads smoothly from your browser. Gas is only required when anchoring the final post transaction on 0G Mainnet.'
    },
    {
      q: 'Can my posts or images ever be censored or deleted?',
      a: 'No. Once a blob root hash is committed to 0G Storage and the post ID is logged in the SocialVault smart contract on 0G Mainnet (Chain ID 16661), the cryptographic record is permanent and sovereign.'
    }
  ];

  return (
    <div className="fade-up" style={{ 
      background: 'var(--bg)', 
      color: 'var(--text)', 
      minHeight: '100vh',
      paddingBottom: 80 
    }}>
      
      {/* ── 1. HERO SECTION (Ramp / Linear Minimalist Clean Hero) ── */}
      <section className="app-rail" style={{ 
        paddingTop: 50, 
        paddingBottom: 60, 
        textAlign: 'center', 
        position: 'relative' 
      }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 999,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5' }} />
            0G Modular Storage Protocol · Sovereign SocialFi
          </div>

          {/* Primary Editorial Headline */}
          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            color: 'var(--text)',
            marginBottom: 20,
          }}>
            Own your content. <br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Powered by 0G permanent storage.
            </span>
          </h1>

          {/* Clean Sub-paragraph */}
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: 620,
            margin: '0 auto 36px',
            fontWeight: 450,
          }}>
            SocialVault is the sovereign social network built on 0G. Secure your media assets, 
            tokenize agentic prompt states, and tip creators in stablecoins with zero platform friction.
          </p>

          {/* Hero Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 50, flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('feed')}
              className="primary-btn"
              style={{
                padding: '14px 36px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Launch Social Feed <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="secondary-btn"
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 600,
                background: 'var(--bg-secondary)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              How It Works
            </button>
          </div>

          {/* ── Floating 3D/Glass Hero Visual (Like Reference) ── */}
          <div style={{
            position: 'relative',
            maxWidth: 760,
            margin: '0 auto',
            borderRadius: 28,
            padding: 3,
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(13, 148, 136, 0.1), rgba(228, 228, 231, 0.4))',
            boxShadow: '0 30px 60px -20px rgba(79, 70, 229, 0.15)',
          }}>
            <div style={{
              background: 'var(--surface)',
              borderRadius: 26,
              padding: '36px 32px',
              border: '1px solid var(--border)',
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle background ambient ring */}
              <div style={{
                position: 'absolute',
                top: -80,
                right: -80,
                width: 220,
                height: 220,
                borderRadius: '50%',
                border: '24px solid rgba(79, 70, 229, 0.04)',
                pointerEvents: 'none',
              }} />

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                  }}>
                    0G
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                      0x2d77...c0f3
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Anchored on 0G Storage Turbo · Merkle Verified
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 700,
                }}>
                  ● 0G Mainnet #16661
                </span>
              </div>

              {/* Card Body */}
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text)', marginBottom: 20 }}>
                Autonomous creator state and media blob anchored directly into 0G decentralized storage nodes. Merkle root hash committed to SocialVault contract with sub-second retrieval.
              </p>

              {/* Proof Breakdown */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                background: 'var(--bg-secondary)',
                padding: 16,
                borderRadius: 16,
                border: '1px solid var(--border)',
                marginBottom: 20,
              }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>0G Merkle Root</div>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>0x7f4b89...1e948c2</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Chunk Size</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>256 KB Leaf Nodes</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase' }}>Consensus Layer</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginTop: 2 }}>Verified on ChainScan</div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => onNavigate('feed')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 20,
                      background: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Zap size={13} fill="#fff" /> Tip Creator (USDC)
                  </button>
                  <a
                    href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    View on 0G ChainScan <ExternalLink size={11} />
                  </a>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'monospace' }}>Post #9</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. "HOW TO USE / HOW IT WORKS" 3-COLUMN SECTION (Like Reference) ── */}
      <section id="how-it-works" className="app-rail" style={{ paddingTop: 60, paddingBottom: 60, borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 12,
          }}>
            How to use the SocialVault protocol
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Three simple steps from local media upload to permanent on-chain consensus.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 32,
          maxWidth: 960,
          margin: '0 auto',
        }}>
          {[
            {
              step: '01',
              title: 'Ingest & Merklize',
              desc: 'Upload images, video, or JSON metadata. The 0G browser SDK slices files into 256KB chunks and computes the cryptographic Merkle root hash locally in your client.',
            },
            {
              step: '02',
              title: '0G Turbo Node Sharding',
              desc: 'Chunks are broadcast directly to 0G Turbo decentralized storage nodes with erasure coding for high-speed indexing and verifiable data availability.',
            },
            {
              step: '03',
              title: 'On-Chain Anchoring & Tips',
              desc: 'The Merkle root is immutably anchored in SocialVault.sol on 0G Mainnet. Creators earn instant 98% payouts with zero platform intermediary risk.',
            },
          ].map((item, idx) => (
            <div key={idx} style={{
              textAlign: 'center',
              padding: '24px 16px',
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 900,
                color: '#4f46e5',
                fontFamily: 'monospace',
                marginBottom: 12,
                letterSpacing: '0.05em',
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. STAGGERED DEEP-DIVE FEATURE BLOCKS (Like Reference) ── */}
      <section className="app-rail" style={{ paddingTop: 40, paddingBottom: 60 }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            margin: 0,
          }}>
            Understanding your on-chain media
          </h2>
        </div>

        {/* Staggered Row 1: Left Text, Right Visual */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'center',
          maxWidth: 960,
          margin: '0 auto 60px',
        }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 14, letterSpacing: '-0.02em' }}>
              Deconstruct your 0G Merkle roots
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
              Instead of trusting a centralized database or paying recurring IPFS pinning fees, every post on SocialVault generates a verifiable Merkle DAG. Inspect chunk proofs, download segments independently, and verify authenticity on StorageScan at any time.
            </p>
            <button
              onClick={() => onNavigate('feed')}
              className="secondary-btn"
              style={{
                padding: '10px 22px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                color: '#4f46e5',
                borderColor: 'rgba(79, 70, 229, 0.3)',
              }}
            >
              Explore Verified Feed →
            </button>
          </div>

          {/* Visual Card 1 */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: 28,
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <ShieldCheck size={20} color="#10b981" />
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                Merkle Tree Cryptographic Verification
              </span>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 14,
              padding: 16,
              fontSize: 12,
              fontFamily: 'monospace',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              border: '1px solid var(--border)',
            }}>
              <div style={{ color: '#4f46e5', fontWeight: 700 }}>Root: 0x7f4b89e21d34c901aa884e92...</div>
              <div style={{ color: 'var(--text-muted)', paddingLeft: 12 }}>├─ Branch L1: 0x4a91... (Leaf 1 & 2)</div>
              <div style={{ color: 'var(--text-muted)', paddingLeft: 12 }}>└─ Branch R1: 0x9c32... (Leaf 3 & 4)</div>
              <div style={{ color: '#10b981', fontWeight: 700, marginTop: 4 }}>✓ 100% Segments Verified on 0G Turbo</div>
            </div>
          </div>
        </div>

        {/* Staggered Row 2: Left Visual, Right Text */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 40,
          alignItems: 'center',
          maxWidth: 960,
          margin: '0 auto',
        }}>
          {/* Visual Card 2 */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 24,
            padding: 28,
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>
                0G Pay Instant Settlement
              </span>
              <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: 12, fontWeight: 700 }}>
                98% Creator Split
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 13,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                <span style={{ color: 'var(--text-muted)' }}>Fan Tipped:</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>10.00 USDC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                <span style={{ color: 'var(--text-muted)' }}>Creator Wallet:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>+9.80 USDC (Instant)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 10 }}>
                <span style={{ color: 'var(--text-muted)' }}>Protocol Contribution:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>0.20 USDC (2%)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 14, letterSpacing: '-0.02em' }}>
              Direct monetization with zero platform cuts
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
              Web2 social networks take 30% to 50% of creator revenue and subject creators to opaque demonetization. SocialVault executes non-custodial smart contract splits where 98% of tips reach the creator wallet automatically.
            </p>
            <button
              onClick={() => onNavigate('profile')}
              className="secondary-btn"
              style={{
                padding: '10px 22px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                color: '#4f46e5',
                borderColor: 'rgba(79, 70, 229, 0.3)',
              }}
            >
              View Creator Dashboard →
            </button>
          </div>
        </div>

      </section>

      {/* ── 4. INTERACTIVE ACCORDION FAQ SECTION (Like Reference) ── */}
      <section className="app-rail" style={{ paddingTop: 60, paddingBottom: 60, borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: 10,
            }}>
              Understanding income statements & 0G storage
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>
              Frequently asked questions about 0G modular storage, fees, and smart contract anchoring.
            </p>
          </div>

          {/* Accordion list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      fontSize: 15,
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="#4f46e5" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 24px 20px',
                      fontSize: 14,
                      lineHeight: 1.65,
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border)',
                      paddingTop: 16,
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CALCULATOR BENTO CARDS ("Keep crunching your numbers" style) ── */}
      <section className="app-rail" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 36px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 8,
          }}>
            Keep crunching your numbers
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>
            Compare decentralized 0G storage efficiency and direct creator earnings.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
          maxWidth: 840,
          margin: '0 auto',
        }}>
          {/* Tool Card 1: 0G Storage Cost Simulator */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 28,
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Calculator size={18} color="#4f46e5" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  0G Storage Fee Estimator
                </h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
                Simulate storage costs on 0G Turbo Nodes vs AWS S3 & IPFS pinning.
              </p>

              {/* Slider */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <span>Asset Size:</span>
                  <span style={{ color: '#4f46e5' }}>{storageSize} MB</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={storageSize}
                  onChange={(e) => setStorageSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#4f46e5' }}
                />
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                padding: 12,
                borderRadius: 12,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>Estimated 0G Fee:</span>
                <strong style={{ color: '#10b981' }}>&lt; 0.00001 0G</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigate('feed')}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '10px',
                borderRadius: 12,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Start Uploading →
            </button>
          </div>

          {/* Tool Card 2: Creator Revenue Split Calculator */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 28,
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Coins size={18} color="#10b981" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Creator Earnings Calculator
                </h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
                Calculate your direct earnings with 98% non-custodial smart contract payouts.
              </p>

              {/* Slider */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  <span>Monthly Tips:</span>
                  <span style={{ color: '#10b981' }}>${tipCalcAmount} USDC</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={tipCalcAmount}
                  onChange={(e) => setTipCalcAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                padding: 12,
                borderRadius: 12,
                fontSize: 12,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>Your Take-Home (98%):</span>
                <strong style={{ color: '#10b981' }}>${(tipCalcAmount * 0.98).toFixed(2)} USDC</strong>
              </div>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '10px',
                borderRadius: 12,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Open Creator Profile →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. PRE-FOOTER MINIMALIST CTA (Like Reference) ── */}
      <section className="app-rail" style={{ paddingTop: 40, paddingBottom: 60, textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: 14,
          }}>
            It's time to own your social graph
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
            Connect your wallet to browse the live feed, post media, and earn on 0G Mainnet.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('feed')}
              style={{
                padding: '14px 36px',
                borderRadius: 999,
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
              }}
            >
              Launch App
            </button>
            <a
              href={`https://chainscan.0g.ai/address/${SOCIALVAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 28px',
                borderRadius: 999,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View on 0G ChainScan
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. LUXURY MULTI-COLUMN FOOTER (Like Reference) ── */}
      <footer style={{
        background: '#09090b',
        color: '#a1a1aa',
        paddingTop: 60,
        paddingBottom: 40,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: 13,
      }}>
        <div className="app-rail">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32,
            marginBottom: 48,
          }}>
            {/* Col 1 */}
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 14 }}>
                0G SocialVault
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#71717a' }}>
                The sovereign SocialFi platform built on 0G modular infrastructure. Permanent storage & on-chain creator economy.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 14 }}>0G Network</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>0G Website</a>
                <a href="https://chainscan.0g.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>0G ChainScan</a>
                <a href="https://storagescan.0g.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>0G StorageScan</a>
                <a href="https://docs.0g.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>0G Documentation</a>
              </div>
            </div>

            {/* Col 3 */}
            <div>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 14 }}>Protocol</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => onNavigate('feed')} style={{ background: 'none', border: 'none', color: '#a1a1aa', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: 13 }}>Global Feed</button>
                <button onClick={() => onNavigate('explore')} style={{ background: 'none', border: 'none', color: '#a1a1aa', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: 13 }}>Ecosystem Explore</button>
                <button onClick={() => onNavigate('profile')} style={{ background: 'none', border: 'none', color: '#a1a1aa', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: 13 }}>Creator Dashboard</button>
                <button onClick={() => onNavigate('about')} style={{ background: 'none', border: 'none', color: '#a1a1aa', textAlign: 'left', padding: 0, cursor: 'pointer', fontSize: 13 }}>About SocialVault</button>
              </div>
            </div>

            {/* Col 4 */}
            <div>
              <div style={{ color: '#fff', fontWeight: 700, marginBottom: 14 }}>Hackathon</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#71717a' }}>0G Bridge Hackathon</span>
                <span style={{ color: '#71717a' }}>AKINDO Wave 3</span>
                <a href="https://github.com/ritesh59697/0g-socialvault" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>GitHub Repository</a>
                <a href="https://youtu.be/vMZjEOf3uKA" target="_blank" rel="noopener noreferrer" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Demo Video</a>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12,
            color: '#71717a',
          }}>
            <div>
              © 2026 SocialVault. Built for the 0G Modular Ecosystem.
            </div>
            <div>
              Smart Contract: <code style={{ color: '#a1a1aa', fontFamily: 'monospace' }}>0xBb5fd4f8eDd916Bbf22FB7Bc7B7dE9F5d84C547a</code>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
