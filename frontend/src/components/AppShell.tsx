'use client';
import { useAccount, useConnect, useDisconnect, useReadContract, useSwitchChain } from 'wagmi';
import { useEffect, useState, useMemo } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { Tab } from '@/lib/types';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detect active tab from URL for persistent layout smoothness
  const effectiveTab = useMemo(() => {
    if (pathname.startsWith('/profile/')) return 'profile';
    if (pathname === '/about') return 'about';
    const tab = searchParams.get('tab');
    if (tab && ['home', 'feed', 'explore', 'profile', 'about'].includes(tab)) return tab as Tab;
    return 'home';
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isConnected && chain?.id !== 16661) switchChain({ chainId: 16661 });
  }, [isConnected, chain?.id, switchChain]);

  useEffect(() => {
    const saved = localStorage.getItem('sv-theme') as 'dark' | 'light' | null;
    if (saved) { 
      setTheme(saved); 
      document.documentElement.setAttribute('data-theme', saved); 
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sv-theme', next);
  };

  const { data: feedData } = useReadContract({
    address: SOCIALVAULT_ADDRESS, abi: SOCIALVAULT_ABI,
    functionName: 'getFeed', args: [BigInt(0), BigInt(20)],
    query: { enabled: !!SOCIALVAULT_ADDRESS },
  });

  const total = feedData?.[1] || BigInt(0);
  const isWrongNetwork = isConnected && chain?.id !== 16661;
  const doSwitch = () => switchChain({ chainId: 16661 });
  const doConnect = () => {
    if (connectors.length > 0) {
      const injected = connectors.find(c => c.id === 'injected');
      connect({ connector: injected || connectors[0] });
    } else {
      alert("No wallet connectors found. Please install MetaMask or another 0G-compatible wallet.");
    }
  };

  const handleTabChange = (t: Tab) => {
    setIsSidebarOpen(false); 
    if (t === 'home') router.push('/');
    else if (t === 'profile') {
      if (address) router.push(`/profile/${address}`);
      else doConnect();
    }
    else router.push(`/?tab=${t}`);
  };

  return (
    <div className="app-shell">
      <Sidebar 
        activeTab={effectiveTab} 
        setActiveTab={handleTabChange} 
        total={total} 
        isConnected={isConnected} 
        isWrongNetwork={!!isWrongNetwork} 
        address={address}
        onSwitchChain={doSwitch} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onConnect={doConnect}
        onDisconnect={() => disconnect()}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="app-scroll">
        <Header 
          activeTab={effectiveTab} 
          address={address} 
          isConnected={isConnected} 
          isWrongNetwork={!!isWrongNetwork} 
          onConnect={doConnect} 
          onDisconnect={() => disconnect()}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="app-main">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
