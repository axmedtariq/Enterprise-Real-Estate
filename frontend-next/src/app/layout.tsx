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
          <nav className="fixed top-0 w-full z-[100] px-10 py-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-[#d4af37] p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase">
                Sovereign <span className="text-[#d4af37]">Estate</span>
              </h1>
            </Link>

            <div className="flex items-center gap-10">
              <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors">
                Market
              </Link>
              <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors">
                Elite Tiers
              </Link>
              <Link href="/feed" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors">
                Live Feed
              </Link>
              <Link href="/admin/add-property">
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  <LayoutDashboard className="w-4 h-4" />
                  Agent Portal
                </button>
              </Link>
            </div>
          </nav>

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
