'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Crown, Loader2, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SovereignControlLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            const data = res.data;

            if (data.user && data.user.role === 'SUPER_ADMIN') {
                // Storing token solely for Admin route validation wrapper uses
                localStorage.setItem('adminToken', data.token);
                router.push('/sovereign-control');
            } else {
                setError('Unauthorized. Super Admin clearance required.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-4 border border-[#d4af37]/30">
                        <Crown className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest text-center">Sovereign Control</h1>
                    <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Authorized Personnel Only
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2 block">Admin Identifier</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4af37]/50"
                            placeholder="director@sovereign.estate"
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2 block">Security Passcode</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#d4af37]/50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d4af37] text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl mt-4 hover:bg-[#f1d27b] transition-colors flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
                    </button>

                    <Link href="/" className="text-slate-500 text-xs text-center mt-4 hover:text-white transition-colors">
                        Return to Public Portal
                    </Link>
                </form>
            </div>
        </div>
    );
}
