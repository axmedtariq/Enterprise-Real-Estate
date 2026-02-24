import Link from 'next/link';
import { Crown, Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#020617] mt-24 border-t border-white/5 relative overflow-hidden text-white">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <Crown className="w-8 h-8 text-[#d4af37] group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all" />
                            <span className="text-xl font-black tracking-widest uppercase">
                                Sovereign <span className="text-[#d4af37]">Estate</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Curating the most exclusive properties around the globe for the ultra-wealthy. Find your legacy.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-all bg-white/5 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-all bg-white/5 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#d4af37] hover:border-[#d4af37] transition-all bg-white/5 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#d4af37]/30 pb-2 inline-block">Sovereign Access</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-0 transition-opacity" /> View Portfolio</Link></li>
                            <li><Link href="/feed" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-0 transition-opacity" /> Luxury Reels</Link></li>
                            <li><Link href="/pricing" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-0 transition-opacity" /> Exclusive Memberships</Link></li>
                            <li><Link href="/about" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-0 transition-opacity" /> Our Legacy</Link></li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#d4af37]/30 pb-2 inline-block">Support & Legal</h3>
                        <ul className="flex flex-col gap-4">
                            <li><Link href="/concierge" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors">24/7 Concierge</Link></li>
                            <li><Link href="/faq" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors">Client FAQ</Link></li>
                            <li><Link href="/privacy" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors">Privacy Paradigm</Link></li>
                            <li><Link href="/terms" className="text-slate-400 hover:text-[#d4af37] font-medium text-sm transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#d4af37]/30 pb-2 inline-block">Private Office</h3>
                        <ul className="flex flex-col gap-5 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                                <span className="text-slate-400 leading-relaxed font-medium">15 Hudson Yards, 88th Floor<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                                <span className="text-slate-400 font-medium">+1 (800) SOVEREIGN</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#d4af37] shrink-0" />
                                <span className="text-slate-400 font-medium pt-1">concierge@sovereign.estate</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs font-medium">
                        &copy; {new Date().getFullYear()} Sovereign Estate. All Rights Reserved. Not a public offering.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">
                            Global Network Active
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
