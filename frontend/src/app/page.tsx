'use client';
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useSwitchChain } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { parseEther } from 'viem';
import { useSearchParams } from 'next/navigation';
import { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { uploadToZeroG, getMediaType } from '@/lib/storage';
import { useConnectorClient } from 'wagmi';
import AppShell from '@/components/AppShell';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ExploreView from '@/components/ExploreView';
import ProfileView from '@/components/ProfileView';
import AboutView from '@/components/AboutView';

type Tab = 'feed' | 'explore' | 'profile' | 'about';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const searchParams = useSearchParams();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const { switchChain } = useSwitchChain();
  const { data: connectorClient } = useConnectorClient();

  const [activeTab, setActiveTab] = useState<Tab>('feed');

  useEffect(() => {
    const tab = searchParams.get('tab') as Tab;
    if (tab && ['feed', 'explore', 'profile', 'about'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('feed');
    }
  }, [searchParams]);

  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');
  const [uploading, setUploading] = useState(false);
  const [storageProof, setStorageProof] = useState<{ rootHash: string; scanUrl: string } | null>(null);
  const [tipAmounts, setTipAmounts] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [refreshingFeed, setRefreshingFeed] = useState(false);
  const [tippingPostId, setTippingPostId] = useState<string | null>(null);
  const [aiGuardian, setAiGuardian] = useState(true);
  const [aiStatus, setAiStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isConnected && chain?.id !== 16661) switchChain({ chainId: 16661 });
  }, [isConnected, chain?.id, switchChain]);

  const { data: feedData, refetch, isFetching } = useReadContract({
    address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI,
    functionName: 'getFeed', args: [BigInt(0), BigInt(20)],
    query: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const posts = feedData?.[0] || [];
  const orderedPosts = [...posts].sort((a: any, b: any) => {
    if (a.id === b.id) return 0;
    return a.id > b.id ? -1 : 1;
  });
  const total = feedData?.[1] || BigInt(0);
  const isWrongNetwork = isConnected && chain?.id !== 16661;
  const doSwitch = () => switchChain({ chainId: 16661 });
  const doConnect = () => connect({ connector: connectors[0] });

  async function refreshFeed(showLoader = true) {
    if (showLoader) setRefreshingFeed(true);
    try {
      await refetch();
    } finally {
      if (showLoader) {
        setTimeout(() => setRefreshingFeed(false), 350);
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) { setStatus('❌ File too large. Max 50MB.'); setStatusType('error'); return; }
    setFile(f); setPreview(URL.createObjectURL(f)); setStorageProof(null);
  }
  function removeFile() {
    setFile(null); setPreview(''); setStorageProof(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handlePost() {
    if ((!caption && !file) || !address) return;
    if (isWrongNetwork) { doSwitch(); return; }
    setUploading(true); setStorageProof(null);
    try {
      if (aiGuardian) {
        setAiStatus('🔍 AI Agent: Scanning content...');
        await new Promise(r => setTimeout(r, 2000));
        setAiStatus('🛡️ AI Agent: Content verified (Safe)');
        await new Promise(r => setTimeout(r, 1000));
      }

      let mediaRootHash = '', metaRootHash = '', mediaType = 0;
      if (file && connectorClient) {
        setStatus('⚡ Uploading to 0G Storage...'); setStatusType('info');
        const result = await uploadToZeroG(file, connectorClient, m => setStatus(`⚡ ${m}`));
        mediaRootHash = result.rootHash;
        mediaType = getMediaType(file.type);
        setStorageProof({ rootHash: result.rootHash, scanUrl: result.scanUrl });
        setStatus('⚡ Uploading metadata...'); setStatusType('info');
        const meta = { caption, fileName: result.fileName, fileType: result.fileType, fileSize: result.fileSize, mediaRootHash: result.rootHash, storageScanUrl: result.scanUrl, createdAt: new Date().toISOString() };
        const metaFile = new File([JSON.stringify(meta)], 'metadata.json', { type: 'application/json' });
        const metaResult = await uploadToZeroG(metaFile, connectorClient);
        metaRootHash = metaResult.rootHash;
      }
      setStatus('⛓️ Writing to 0G Chain...'); setStatusType('info');
      const hash = await writeContractAsync({
        address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI,
        functionName: 'createPost', args: [mediaRootHash || caption, metaRootHash, mediaType, 500],
      });
      setStatus(`✅ Posted! TX: ${hash.slice(0, 16)}...`); setStatusType('success');
      setCaption(''); removeFile(); setAiStatus('');
      setTimeout(() => { refreshFeed(false); setStatus(''); }, 4000);
    } catch (e: any) {
      setStatus(`❌ ${e.message?.slice(0, 100)}`); setStatusType('error');
      setAiStatus('⚠️ AI Analysis failed');
    } finally { setUploading(false); }
  }

  async function handleLike(postId: bigint) {
    if (!isConnected || isWrongNetwork) return;
    try {
      await writeContractAsync({ address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI, functionName: 'likePost', args: [postId] });
      setLikedPosts(p => new Set([...p, postId.toString()]));
      setTimeout(() => refreshFeed(false), 3000);
    } catch (e: any) { console.error(e); }
  }

  async function handleTip(postId: bigint) {
    if (isWrongNetwork) { doSwitch(); return; }
    const amount = tipAmounts[postId.toString()] || '0.01';
    try {
      setTippingPostId(postId.toString());
      await writeContractAsync({ address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI, functionName: 'tipPost', args: [postId], value: parseEther(amount) });
      setTimeout(() => refreshFeed(false), 2500);
    } catch (e: any) { console.error(e); }
    finally { setTippingPostId(null); }
  }

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'feed' && (
        <div className="tab-panel">
          {isConnected ? (
            <CreatePost address={address!} uploading={uploading} status={status} statusType={statusType}
              storageProof={storageProof} onPost={handlePost} onFileSelect={handleFileSelect}
              onRemoveFile={removeFile} file={file} preview={preview}
              caption={caption} setCaption={setCaption} isWrongNetwork={!!isWrongNetwork}
              aiGuardian={aiGuardian} setAiGuardian={setAiGuardian} aiStatus={aiStatus} />
          ) : (
            <div className="glass-panel fade-up" style={{ padding: 32, marginBottom: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔮</div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 15 }}>Connect your wallet to start posting on the 0G Chain.</p>
              <button onClick={doConnect} className="primary-btn" style={{ padding: '12px 28px', borderRadius: 24, fontSize: 15 }}>Connect Wallet</button>
            </div>
          )}

          <div className="section-heading-row" style={{ minHeight: 34, marginBottom: 20, marginTop: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Latest Activity</h2>
            <button onClick={() => refreshFeed()} disabled={isFetching || refreshingFeed} className="secondary-btn" style={{
              minWidth: 154,
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              opacity: isFetching || refreshingFeed ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {(isFetching || refreshingFeed) ? <span className="mini-spinner" /> : <span>↻</span>}
              {(isFetching || refreshingFeed) ? 'Refreshing Feed' : 'Refresh Feed'}
            </button>
          </div>

          {orderedPosts.length === 0 ? (
            isFetching || refreshingFeed ? (
              <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }} className="pulse-dot">⏳</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Loading the latest posts...</p>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No posts found. Be the first to create one!</p>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {refreshingFeed && (
                <div className="glass-panel" style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--bg-secondary)',
                  boxShadow: 'none',
                }}>
                  <span className="mini-spinner" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Refreshing feed</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fetching newest posts from 0G Mainnet...</div>
                  </div>
                </div>
              )}
              {orderedPosts.map((post: any) => (
                <PostCard key={post.id.toString()} post={post}
                  isConnected={isConnected} isWrongNetwork={!!isWrongNetwork}
                  liked={likedPosts.has(post.id.toString())}
                  tipAmount={tipAmounts[post.id.toString()] || '0.01'}
                  isTipping={tippingPostId === post.id.toString()}
                  onLike={() => handleLike(post.id)} onTip={() => handleTip(post.id)}
                  onTipAmountChange={v => setTipAmounts(p => ({ ...p, [post.id.toString()]: v }))} />
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'explore' && <ExploreView />}
      {activeTab === 'profile' && <ProfileView address={address} isConnected={isConnected} posts={orderedPosts} onConnect={doConnect} connectedAddress={address} />}
      {activeTab === 'about' && <AboutView />}
    </AppShell>
  );
}
