'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Home, CalendarCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const propertyId = searchParams.get('property_id');

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Glowing Grid Background (subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(212,175,55,0.05)] overflow-hidden"
            >
                {/* Decorative border highlight at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />

                <div className="flex flex-col items-center text-center space-y-6">

                    {/* Icon Reveal */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-[#d4af37]/10 rounded-full flex items-center justify-center border border-[#d4af37]/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    >
                        <CheckCircle className="w-12 h-12 text-[#d4af37]" strokeWidth={1.5} />
                    </motion.div>

                    {/* Typography */}
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-5xl font-black tracking-tighter"
                        >
                            Reservation <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]">Confirmed</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-slate-400 text-lg max-w-md mx-auto"
                        >
                            Your payment has been successfully secured. Welcome to the Elite Sovereign Experience.
                        </motion.p>
                    </div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-6 py-6 border-y border-white/5 w-full justify-center text-sm font-medium text-slate-300"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                            <span>Payment Secured</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-[#d4af37]" />
                            <span>Dates Reserved</span>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row w-full gap-4 pt-4"
                    >
                        {propertyId ? (
                            <Link
                                href={`/property/${propertyId}`}
                                className="flex-1 group relative overflow-hidden bg-[#d4af37] text-black font-bold uppercase tracking-widest py-4 px-6 rounded-xl transition-all duration-300 hover:bg-white hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <span className="relative z-10">Return to Property</span>
                            </Link>
                        ) : null}

                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-300"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home Page</span>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Footer message */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 text-center text-sm text-slate-500 max-w-lg"
            >
                A confirmation email with your detailed itinerary and concierge contact information has been dispatched to your verified address.
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
