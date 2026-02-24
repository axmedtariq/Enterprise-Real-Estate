'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Calendar, DollarSign, Wallet2, MapPin, Eye, CheckCircle2 } from 'lucide-react';

export default function AgencyPartnerDashboard() {
    const router = useRouter();
    // Using Mock data until backend is fully wired for agencies
    const [assets] = useState([
        { id: 1, title: 'Downtown Horizon Penthouse', price: 850, bookings: 12, views: 342, status: 'Active' },
        { id: 2, title: 'Palm Jumeirah Villa', price: 2500, bookings: 3, views: 154, status: 'Active' },
        { id: 3, title: 'Marina Luxury Suite', price: 450, bookings: 28, views: 892, status: 'Maintenance' },
    ]);

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Top Navigation */}
            <div className="bg-black/40 border-b border-white/5 backdrop-blur-xl h-20 flex items-center px-8 justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-widest uppercase">Partner Portal</h1>
                        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Elite Real Estate Partners</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2">
                        <Wallet2 className="w-4 h-4" /> Withdraw Funds
                    </button>
                    <button className="bg-[#d4af37] hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> List New Asset
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8 pt-12">
                {/* Agency Analytics Overview */}
                <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-slate-200">Portfolio Performance</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 bg-emerald-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <DollarSign className="w-8 h-8 text-emerald-400 mb-4" />
                        <h3 className="text-4xl font-black mb-1">$142,500</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 bg-[#d4af37]/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all"></div>
                        <Building2 className="w-8 h-8 text-[#d4af37] mb-4" />
                        <h3 className="text-4xl font-black mb-1">24</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Listings</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 bg-blue-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                        <Calendar className="w-8 h-8 text-blue-400 mb-4" />
                        <h3 className="text-4xl font-black mb-1">43</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Upcoming Bookings</p>
                    </div>
                </div>

                {/* Sub-Accounts / Asset List */}
                <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-slate-200 mt-16">Managed Assets</h2>
                <div className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-xs uppercase tracking-widest text-[#d4af37] border-b border-white/10">
                                <tr>
                                    <th className="p-6 font-black">Property Details</th>
                                    <th className="p-6 font-black">Price / Night</th>
                                    <th className="p-6 font-black">Total Bookings</th>
                                    <th className="p-6 font-black">Status</th>
                                    <th className="p-6 font-black text-right">Metrics</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {assets.map(asset => (
                                    <tr key={asset.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push(`/property/${asset.id}`)}>
                                        <td className="p-6">
                                            <p className="font-bold text-white text-md flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#d4af37]" /> {asset.title}
                                            </p>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-slate-300 font-mono font-bold">${asset.price}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-white font-black">{asset.bookings}</span>
                                        </td>
                                        <td className="p-6">
                                            {asset.status === 'Active' ? (
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-max border border-emerald-400/20">
                                                    <CheckCircle2 className="w-3 h-3" /> {asset.status}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full w-max border border-orange-400/20">
                                                    Maintenance
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-400 font-mono text-sm">
                                                <Eye className="w-4 h-4 text-blue-400" /> {asset.views}
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
