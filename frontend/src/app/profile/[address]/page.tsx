'use client';
import { useState, useMemo, useEffect } from 'react';
import { useAccount, useReadContract, useConnect, useSwitchChain, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { useParams } from 'next/navigation';
import { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } from '@/lib/contract';
import AppShell from '@/components/AppShell';
import ProfileView from '@/components/ProfileView';

export default function DedicatedProfilePage() {
  const params = useParams();
  const targetAddress = params.address as string;
  const { address: connectedAddress, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();

  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  const isOwnProfile = connectedAddress?.toLowerCase() === targetAddress?.toLowerCase();

  // Auto-redirect if wallet changes while on own profile
  useEffect(() => {
    if (isConnected && connectedAddress && isOwnProfile === false && targetAddress === 'me') {
       router?.replace(`/profile/${connectedAddress}`);
    }
  }, [connectedAddress, isConnected, isOwnProfile, targetAddress, router]);

  // Fetch feed to get user's posts (filtering on client side)
  const { data: feedData, isFetching, refetch } = useReadContract({
    address: SOCIALVAULT_ADDRESS,
    abi: SOCIALVAULT_ABI,
    functionName: 'getFeed',
    args: [BigInt(0), BigInt(200)], // Scan more posts for accuracy
  });

  const posts = feedData?.[0] || [];
  const doConnect = () => connect({ connector: connectors[0] });

  const { writeContractAsync } = useWriteContract();
  const [tipAmounts, setTipAmounts] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isTipping, setIsTipping] = useState(false);

  async function handleLike(postId: bigint) {
    if (!isConnected || chain?.id !== 16661) {
       if (isConnected && chain?.id !== 16661) switchChain({ chainId: 16661 });
       return;
    }
    try {
      await writeContractAsync({ address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI, functionName: 'likePost', args: [postId] });
      setLikedPosts(p => new Set([...p, postId.toString()]));
      setTimeout(() => refetch(), 3000);
    } catch (e: any) { console.error(e); }
  }

  async function handleTip(postId: bigint) {
    if (chain?.id !== 16661) { switchChain({ chainId: 16661 }); return; }
    const amount = tipAmounts[postId.toString()] || '0.01';
    try {
      setIsTipping(true);
      await writeContractAsync({ address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI, functionName: 'tipPost', args: [postId], value: parseEther(amount) });
      
      // Track tip locally for UI
      const post = (posts as any[]).find((p: any) => p.id === postId);
      if (post) {
        const addr = post.author.toLowerCase();
        const tipRecord = { 
          from: connectedAddress?.slice(0, 6) + '...' + connectedAddress?.slice(-4), 
          amount, time: 'just now', id: Date.now() 
        };
        const existing = JSON.parse(localStorage.getItem(`sv_tips_${addr}`) || '[]');
        localStorage.setItem(`sv_tips_${addr}`, JSON.stringify([tipRecord, ...existing]));
      }

      setTimeout(() => refetch(), 2500);
    } catch (e: any) { console.error(e); }
    finally { setIsTipping(false); }
  }

  // Sync highlighting: if it's our own profile, highlight "profile", otherwise "explore"
  const activeSidebarTab = isOwnProfile ? 'profile' : 'explore';

  return (
    <AppShell activeTab={activeSidebarTab}>
      <div className="tab-panel app-rail" style={{ paddingTop: 40 }}>
        <ProfileView 
          address={targetAddress === 'me' ? connectedAddress : targetAddress} 
          isConnected={isConnected} 
          posts={posts as any[]} 
          onConnect={doConnect}
          isOwnProfile={isOwnProfile}
          connectedAddress={connectedAddress}
          onLike={handleLike}
          onTip={handleTip}
          isTipping={isTipping}
          likedPosts={likedPosts} 
          tipAmounts={tipAmounts}
          setTipAmounts={setTipAmounts}
          isWrongNetwork={!!(isConnected && chain?.id !== 16661)}
        />
      </div>
    </AppShell>
  );
}
