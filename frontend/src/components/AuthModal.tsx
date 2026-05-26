import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  triggerToast,
}: AuthModalProps) {
  const { login, register, error: authError, clearError: clearAuthError } = useAuth();
  const { language } = useLanguage();
  
  const [isAuthModeLogin, setIsAuthModeLogin] = useState(true);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    clearAuthError();
    onClose();
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;
    
    if (isAuthModeLogin) {
      success = await login(authEmail, authPassword);
      if (success) {
        triggerToast(language === 'en' ? 'Logged in successfully!' : 'সফলভাবে লগইন করা হয়েছে!');
        handleClose();
      }
    } else {
      success = await register(authName, authEmail, authPassword);
      if (success) {
        triggerToast(language === 'en' ? 'Registered successfully!' : 'সফলভাবে রেজিস্ট্রেশন করা হয়েছে!');
        handleClose();
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative z-10 shadow-2xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary focus:outline-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h3 className="text-2xl font-bold text-deep-navy text-center mb-6">
          {isAuthModeLogin 
            ? (language === 'en' ? 'Sign In' : 'লগইন') 
            : (language === 'en' ? 'Create Account' : 'অ্যাকাউন্ট তৈরি করুন')}
        </h3>

        {/* Error Notification */}
        {authError && (
          <div className="bg-error-container text-error text-xs p-3 rounded-lg mb-4 text-center font-semibold">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isAuthModeLogin && (
            <div>
              <label className="block text-xs font-semibold mb-1">
                {language === 'en' ? 'Name' : 'নাম'}
              </label>
              <input 
                type="text" 
                required
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm"
                placeholder={language === 'en' ? 'e.g. Tanzim Ahmed' : 'যেমন: তানজিম আহমেদ'}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold mb-1">
              {language === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'}
            </label>
            <input 
              type="email" 
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm"
              placeholder="name@email.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1">
              {language === 'en' ? 'Password' : 'পাসওয়ার্ড'}
            </label>
            <input 
              type="password" 
              required
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#0088FF] text-white text-center rounded-xl hover:bg-[#0088FF]/95 font-semibold transition-all flex justify-center items-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isAuthModeLogin 
                ? (language === 'en' ? 'Login' : 'লগইন করুন') 
                : (language === 'en' ? 'Register' : 'রেজিস্টার করুন')
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-on-surface-variant">
          {isAuthModeLogin 
            ? (language === 'en' ? "Don't have an account?" : "অ্যাকাউন্ট নেই?") 
            : (language === 'en' ? "Already have an account?" : "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{' '}
          <button 
            onClick={() => { setIsAuthModeLogin(!isAuthModeLogin); clearAuthError(); }}
            className="font-bold text-deep-navy hover:underline"
          >
            {isAuthModeLogin 
              ? (language === 'en' ? 'Create one' : 'নতুন তৈরি করুন') 
              : (language === 'en' ? 'Sign in' : 'লগইন করুন')}
          </button>
        </div>
      </div>
    </div>
  );
}
