import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '../store/provider';
import { Crown, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sovereign Estate | Elite Real Estate',
  description: 'Exclusive properties for the ultra-wealthy.',
};

import Navbar from '../components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#020617] text-white min-h-screen selection:bg-[#d4af37] selection:text-black`}>
        <ReduxProvider>
          {/* GLOBAL NAVIGATION */}
          <Navbar />

          <main className="pt-24 min-h-screen">
            {children}
          </main>

          {/* NETWORK STATUS */}
          <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-lg border border-white/10 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl">
              <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Network Reach: <span className="text-white font-mono">1.5M ACTIVE</span>
              </span>
            </div>
          </footer>
        </ReduxProvider>
      </body>
    </html>
  );
}
