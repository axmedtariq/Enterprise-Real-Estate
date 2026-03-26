import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Settings, Key, LogOut } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex items-baseline justify-between border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Sovereign Command
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <p className="text-slate-100 font-medium">{user?.name}</p>
             <p className="text-slate-500 text-xs uppercase tracking-widest">{user?.role}</p>
          </div>
          <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-full text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" /> System Health
          </h2>
          <div className="space-y-3">
             <div className="flex justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Security Protocols</span>
                <span className="text-emerald-400 text-xs font-bold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">ENFORCED</span>
             </div>
             <div className="flex justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <span className="text-slate-400">Infrastructure</span>
                <span className="text-blue-400 text-xs font-bold px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">STABLE</span>
             </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" /> Identity Management
          </h2>
          <div className="space-y-4">
             <p className="text-sm text-slate-400">Session ID: <span className="text-slate-200 font-mono text-xs">{localStorage.getItem('sovereign_token')?.slice(0, 32)}...</span></p>
             <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95">
                Manage Security Credentials
             </button>
          </div>
        </div>
      </main>

      <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl text-blue-200/70 text-sm leading-relaxed italic">
          "Elite Security is not an option—it is the foundation. Every session is protected by OWASP ZAP Top 10 hardening and Istio mTLS encryption."
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8 selection:bg-indigo-500/30">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
               <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                  <h1 className="text-5xl font-extrabold tracking-tighter">SOVEREIGN ACCESS</h1>
                  <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl">
                     <p className="text-slate-400 text-sm mb-6 text-center italic">"Authentication Required to Proceed"</p>
                     <p className="text-xs text-center text-slate-500">Redirecting to enterprise SSO...</p>
                     <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm">Return Home</Link>
                     </div>
                  </div>
               </div>
            } />

            {/* Elite Protected Routes */}
            <Route path="/" element={
               <ProtectedRoute>
                  <Dashboard />
               </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
