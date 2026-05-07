import type { Metadata } from 'next';
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}