'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { resetPassword, clearErrors } from '../../../store/slices/authSlice';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { token } = useParams<{ token: string }>(); // Get token from URL
    const { loading, error, message } = useAppSelector((state) => state.auth);

    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token) {
            dispatch(resetPassword({ token, password }));
        }
    };

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    }, [message, router]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">New Password</h1>
                    <p className="text-slate-400">Secure your account with a strong password</p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg mb-6 flex flex-col items-center gap-2">
                        <CheckCircle className="h-6 w-6" />
                        <span>{message}</span>
                        <span className="text-xs text-green-400">Redirecting to login...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-transparent placeholder-slate-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            <>
                                Update Password
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
