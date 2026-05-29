import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface SecurityShieldProps {
  children: React.ReactNode;
  onExit: () => void;
}

export default function SecurityShield({ children, onExit }: SecurityShieldProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-sans">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#0088FF]/20 border-t-[#0088FF] rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-mono text-sm tracking-widest animate-pulse">
            INITIALIZING SECURITY SHIELD...
          </p>
        </div>
      </div>
    );
  }

  const isAuthorized = user && user.isAdmin;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 text-center shadow-2xl shadow-red-950/20"
        >
          {/* Cyber Lock Icon */}
          <div className="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-inner relative group">
            <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-md opacity-70 animate-pulse" />
            <span className="material-symbols-outlined text-4xl text-red-500 animate-pulse">
              shield_lock
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-100 mb-2 uppercase tracking-wide font-mono">
            Access Restricted
          </h1>
          <div className="h-[2px] w-12 bg-red-500 mx-auto mb-4" />
          
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            This workspace contains sensitive terminal operations. Log in with an administrator account to bypass the firewall.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onExit}
              className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 hover:text-white transition-all duration-300 font-mono text-sm border border-slate-700/50 shadow-lg active:scale-[0.98]"
            >
              RETURN TO MARKETPLACE
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
