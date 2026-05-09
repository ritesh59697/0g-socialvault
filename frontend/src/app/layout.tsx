import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SocialVault — Decentralized Social on 0G Chain',
  description: 'Post, like, and tip creators on the 0G decentralized storage network.',
  openGraph: {
    title: 'SocialVault',
    description: 'Decentralized social feed on 0G Chain. All media stored on 0G Storage.',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}