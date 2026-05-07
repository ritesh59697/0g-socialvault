'use client';
import { useAccount, useConnect, useDisconnect, useReadContract, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } from '@/lib/contract';
import Sidebar from './Sidebar';
import Header from './Header';

type Tab = 'feed' | 'explore' | 'profile' | 'about';

export default function AppShell({
  children,
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab?: (t: Tab) => void;
}) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chain?.id !== 16661) switchChain({ chainId: 16661 });
  }, [isConnected, chain?.id, switchChain]);

  const { data: feedData } = useReadContract({
    address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI,
    functionName: 'getFeed', args: [BigInt(0), BigInt(20)],
  });

  const total = feedData?.[1] || BigInt(0);
  const isWrongNetwork = isConnected && chain?.id !== 16661;
  const doSwitch = () => switchChain({ chainId: 16661 });
  const doConnect = () => {
    if (connectors.length > 0) {
      // Prioritize injected connectors (like MetaMask)
      const injected = connectors.find(c => c.id === 'injected');
      connect({ connector: injected || connectors[0] });
    } else {
      alert("No wallet connectors found. Please install MetaMask or another 0G-compatible wallet.");
    }
  };

  // If setActiveTab is not provided (e.g. on a dedicated page), we just handle navigation via links
  const handleTabChange = (t: Tab) => {
    if (setActiveTab) {
      setActiveTab(t);
    } else {
      // Logic for navigation if needed, but usually the sidebar handles buttons
    }
  };

  return (
    <div className="app-shell">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        total={total} 
        isConnected={isConnected} 
        isWrongNetwork={!!isWrongNetwork} 
        onSwitchChain={doSwitch} 
        address={address}
      />

      <div className="app-scroll">
        <Header 
          activeTab={activeTab} 
          address={address} 
          isConnected={isConnected} 
          isWrongNetwork={!!isWrongNetwork} 
          onConnect={doConnect} 
          onDisconnect={() => disconnect()} 
        />

        <main className="app-rail app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
