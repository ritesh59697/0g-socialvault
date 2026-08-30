import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';
import { Providers } from './providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://0g-socialvault.vercel.app'),
  title: 'SocialVault — Decentralized SocialFi on 0G Network',
  description: 'Post, monetize, and verify on-chain social media anchored permanently to the 0G modular stack.',
  applicationName: '0G SocialVault',
  authors: [{ name: '0G SocialVault Team' }],
  generator: 'Next.js 16',
  keywords: ['0G', 'ZeroG', 'SocialFi', '0G Storage', '0G Chain', 'Web3 Social', 'Decentralized Storage', 'AKINDO'],
  openGraph: {
    title: 'SocialVault — Decentralized SocialFi on 0G Network',
    description: 'Cryptographically anchored social feed on 0G Chain with media on 0G Storage Turbo nodes.',
    url: 'https://0g-socialvault.vercel.app',
    siteName: '0G SocialVault',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: '0G SocialVault Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialVault — Decentralized SocialFi on 0G Network',
    description: 'Cryptographically anchored social feed on 0G Chain with media on 0G Storage Turbo nodes.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get('cookie');
  const initialState = cookieToInitialState(wagmiConfig, cookie);
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers initialState={initialState}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}