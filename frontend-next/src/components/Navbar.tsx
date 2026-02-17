'use client';

import React from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Crown, LayoutDashboard, User, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="fixed top-0 w-full z-[100] px-10 py-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-[#d4af37] p-2 rounded-lg group-hover:rotate-12 transition-transform">
                    <Crown className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-xl font-black tracking-tighter uppercase">
                    Sovereign <span className="text-[#d4af37]">Estate</span>
                </h1>
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors hidden md:block">
                    Market
                </Link>
                <Link href="/pricing" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors hidden md:block">
                    Elite Tiers
                </Link>
                <Link href="/feed" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors hidden md:block">
                    Live Feed
                </Link>

                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors">
                            <User className="w-4 h-4" />
                            {user?.name || 'Profile'}
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin/add-property">
                                <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                    <LayoutDashboard className="w-3 h-3" />
                                    Portal
                                </button>
                            </Link>
                        )}
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-xs font-bold uppercase tracking-widest hover:text-[#d4af37] transition-colors flex items-center gap-2">
                            <LogIn className="w-4 h-4" />
                            Sign In
                        </Link>
                        <Link href="/register">
                            <button className="bg-[#d4af37] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
                                Join
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
