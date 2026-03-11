'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Crown, Loader2, Building2, Users, DollarSign, LogOut, CheckCircle2, XCircle, TrendingUp, ShieldCheck } from 'lucide-react';

interface Stats {
    metrics: { users: number, agencies: number, properties: number, gmV: number };
    agencies: { id: string, name: string, commissionRate: number, status: string, properties: number }[];
}

export default function SovereignControlDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) throw new Error('No token');

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
            const res = await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data.data);
        } catch (err) {
            console.error(err);
            handleLogout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/sovereign-control/login');
    };

    const handleStatusChange = async (agencyId: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
            await axios.put(`${API_URL}/admin/agency/status`,
                { agencyId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } });

            // Optimistic Update
            fetchStats();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 pb-32">
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
                    <div className="flex items-center gap-6 mb-6 md:mb-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-yellow-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <Crown className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-1">Super Admin Console</h1>
                            <p className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest"><ShieldCheck className="w-4 h-4" /> Sovereign Global Root Access</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all">
                            Platform Settings
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/30 transition-all">
                            <LogOut className="w-4 h-4" /> Disconnect
                        </button>
                    </div>
                </div>

                {/* Financial & Platform Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#0f172a] border border-[#d4af37]/30 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-bl-full pointer-events-none" />
                        <DollarSign className="w-8 h-8 text-[#d4af37] mb-4 relative z-10" />
                        <h2 className="text-4xl font-black mb-1 relative z-10">${(stats?.metrics.gmV || 0).toLocaleString()}</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2 relative z-10">Total Booking GMV <TrendingUp className="w-4 h-4 text-emerald-500" /></p>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-white/30 shadow-lg transition-all">
                        <Building2 className="w-8 h-8 text-blue-400 mb-4" />
                        <h2 className="text-4xl font-black mb-1">{stats?.metrics.agencies}</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Partner Agencies</p>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-white/30 shadow-lg transition-all">
                        <Crown className="w-8 h-8 text-purple-400 mb-4" />
                        <h2 className="text-4xl font-black mb-1">{stats?.metrics.properties}</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Total Assets Listed</p>
                    </div>

                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 hover:border-white/30 shadow-lg transition-all">
                        <Users className="w-8 h-8 text-emerald-400 mb-4" />
                        <h2 className="text-4xl font-black mb-1">{stats?.metrics.users}</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Registered Clients</p>
                    </div>
                </div>

                {/* Agency Management Table */}
                <div className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-12">
                    <div className="p-8 border-b border-white/10 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-widest mb-1">Agency Partner Ecosystem</h3>
                            <p className="text-slate-400 text-sm">Approve, suspend, and manage real estate companies operating on your platform.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-xs uppercase tracking-widest text-[#d4af37] border-b border-white/10">
                                <tr>
                                    <th className="p-6 font-black">Agency Name</th>
                                    <th className="p-6 font-black">Assets</th>
                                    <th className="p-6 font-black">Platform Cut</th>
                                    <th className="p-6 font-black">Status</th>
                                    <th className="p-6 font-black text-right">Verification Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats?.agencies.map(a => (
                                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <p className="font-bold text-white text-base">{a.name}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-slate-300 font-mono font-bold bg-white/5 px-3 py-1 rounded-lg">{a.properties}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-emerald-400 font-black">{a.commissionRate}%</span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${a.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/50' : a.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/50' : 'bg-red-500/10 text-red-500 border-red-500/50'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {a.status !== 'APPROVED' && (
                                                    <button onClick={() => handleStatusChange(a.id, 'APPROVED')} className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500 hover:text-emerald-400 transition-colors bg-emerald-500/10 px-3 py-2 rounded-lg">
                                                        <CheckCircle2 className="w-4 h-4" /> Approve
                                                    </button>
                                                )}
                                                {a.status !== 'SUSPENDED' && (
                                                    <button onClick={() => handleStatusChange(a.id, 'SUSPENDED')} className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-2 rounded-lg">
                                                        <XCircle className="w-4 h-4" /> Suspend
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
