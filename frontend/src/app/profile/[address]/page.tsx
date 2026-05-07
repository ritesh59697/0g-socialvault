'use client';
import { useAccount, useReadContract, useConnect, useSwitchChain } from 'wagmi';
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

  const isOwnProfile = connectedAddress?.toLowerCase() === targetAddress?.toLowerCase();

  // Fetch feed to get user's posts (filtering on client side as contract doesn't have getUserPosts)
  const { data: feedData, isFetching, refetch } = useReadContract({
    address: SOCIALVAULT_ADDRESS,
    abi: SOCIALVAULT_ABI,
    functionName: 'getFeed',
    args: [BigInt(0), BigInt(100)], // Fetch more to find user's posts
  });

  const posts = feedData?.[0] || [];
  const doConnect = () => connect({ connector: connectors[0] });

  return (
    <AppShell activeTab="profile">
      <div className="tab-panel">
        <ProfileView 
          address={targetAddress} 
          isConnected={isConnected} 
          posts={posts as any[]} 
          onConnect={doConnect}
          isOwnProfile={isOwnProfile}
          connectedAddress={connectedAddress}
        />
      </div>
    </AppShell>
  );
}
