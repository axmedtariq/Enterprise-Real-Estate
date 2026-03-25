import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[]; // Allowed roles (e.g., ['ADMIN', 'AGENT'])
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // ⏳ LOADING GUARD
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="animate-pulse text-indigo-400 font-bold">SOVEREIGN SECURITY: VERIFYING SESSION...</p>
            </div>
        );
    }

    // 🔒 AUTH GUARD
    if (!isAuthenticated) {
        // Redir to login, but record where the user wanted to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 🕵️ ROLE GUARD (Authorization Handling)
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // ✅ ACCESS GRANTED
    return <>{children}</>;
};
