import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ice-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0088FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Access denied for non-admin users trying to access admin views
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md w-full text-center space-y-4 bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <span className="material-symbols-outlined text-red-500 text-6xl">gpp_bad</span>
          <h1 className="text-2xl font-black">Access Denied</h1>
          <p className="text-slate-400 text-sm">
            You do not have the administrative privileges required to access this area.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
