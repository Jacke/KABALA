import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://kabala.app'
  ),
  title: {
    default: 'KABALA - Global Purchasing Power Dashboard',
    template: '%s | KABALA',
  },
  description:
    'Compare cost of living and purchasing power across cities worldwide. Explore salaries, rent, food, transport, and more.',
  keywords: [
    'cost of living',
    'purchasing power',
    'salary comparison',
    'rent prices',
    'city comparison',
    'expat',
    'relocation',
  ],
  openGraph: {
    title: 'KABALA - Global Purchasing Power Dashboard',
    description:
      'Compare cost of living across cities. Explore salaries, rent, and living costs.',
    type: 'website',
    locale: 'en_US',
    siteName: 'KABALA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KABALA - Global Purchasing Power Dashboard',
    description:
      'Compare cost of living across cities. Explore salaries, rent, and living costs.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
