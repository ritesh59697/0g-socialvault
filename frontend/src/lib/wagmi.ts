import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

export const zgMainnet = defineChain({
  id: 16661,
  name: '0G Mainnet',
  nativeCurrency: { name: '0G Token', symbol: '0G', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evmrpc.0g.ai'] },
    public:  { http: ['https://evmrpc.0g.ai'] },
  },
  blockExplorers: {
    default: { name: 'ChainScan', url: 'https://chainscan.0g.ai' },
  },
});

export const wagmiConfig = createConfig({
  chains: [zgMainnet],
  connectors: [injected()],
  transports: { [zgMainnet.id]: http('https://evmrpc.0g.ai') },
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});