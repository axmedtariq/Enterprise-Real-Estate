'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { enable2FA, verify2FA, logout } from '../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, LogOut, CheckCircle, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, qrCodeUrl, twoFactorSecret, message, error, loading } = useAppSelector((state) => state.auth);

    const [token, setToken] = useState('');

    const handleEnable2FA = () => {
        dispatch(enable2FA());
    };

    const handleVerify2FA = () => {
        dispatch(verify2FA(token));
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    if (!user) {
        // Should redirect or require auth
        return <div className="p-8 text-white">Please log in first.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700"
            >
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-700">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                        <p className="text-slate-400">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium uppercase tracking-wide">
                            {user.role}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${user.twoFactorEnabled ? 'bg-green-500/20 text-green-500' : 'bg-slate-600 text-slate-400'}`}>
                                    {user.twoFactorEnabled ? <ShieldCheck className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                                    <p className="text-sm text-slate-400">
                                        {user.twoFactorEnabled
                                            ? 'Your account is secured with 2FA.'
                                            : 'Add an extra layer of security to your account.'}
                                    </p>
                                </div>
                            </div>

                            {!user.twoFactorEnabled && !qrCodeUrl && (
                                <button
                                    onClick={handleEnable2FA}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Enable 2FA
                                </button>
                            )}
                        </div>

                        {/* QR Code Section */}
                        {qrCodeUrl && !user.twoFactorEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 pt-6 border-t border-slate-600"
                            >
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="bg-white p-4 rounded-xl">
                                        <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <p className="text-slate-300 text-sm">
                                            1. Download Google Authenticator or Authy using your phone.
                                            <br />
                                            2. Scan the QR code.
                                            <br />
                                            3. Enter the 6-digit code below to verify.
                                        </p>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                placeholder="000 000"
                                                className="w-full bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-lg text-center tracking-widest text-lg font-mono focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                            <button
                                                onClick={handleVerify2FA}
                                                disabled={token.length < 6 || loading}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                            >
                                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Code'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {message && (
                            <div className="mt-4 p-4 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
