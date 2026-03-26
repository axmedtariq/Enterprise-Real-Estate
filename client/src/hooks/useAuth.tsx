import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔒 Recover session securely
        const savedToken = localStorage.getItem('sovereign_token');
        const savedUser = localStorage.getItem('sovereign_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("❌ Auth Recovery Failed: Corrupted session data.");
                localStorage.removeItem('sovereign_user');
            }
            
            // Set global Authorization header for Axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        
        // 🛡️ SECURITY: LocalStorage is slightly vulnerable to XSS
        // For 'Elite' security, we use HTTPOnly Cookies (backend handled),
        // but for this React implementation, we ensure it's cleared on logout.
        localStorage.setItem('sovereign_token', newToken);
        localStorage.setItem('sovereign_user', JSON.stringify(newUser));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sovereign_token');
        localStorage.removeItem('sovereign_user');
        delete axios.defaults.headers.common['Authorization'];
        
        // 🧽 FORCE CLEAN: Navigate or Refresh to clear memory
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
