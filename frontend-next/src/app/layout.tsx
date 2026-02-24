import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '../store/provider';
import { Crown, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Sovereign Estate | Elite Real Estate',
  description: 'Exclusive properties for the ultra-wealthy.',
};

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-[#020617]">
      <body className={`${outfit.className} bg-[#020617] text-white selection:bg-[#d4af37] selection:text-black antialiased`}>
        <ReduxProvider>
          {/* GLOBAL NAVIGATION */}
          <Navbar />

          <main className="pt-24 min-h-screen">
            {children}
          </main>

          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
