import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface VerifyEmailViewProps {
  setCurrentTab: (tab: any) => void;
}

export default function VerifyEmailView({ setCurrentTab }: VerifyEmailViewProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { language } = useLanguage();
  const isEN = language === 'en';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(isEN ? 'Verification token is missing.' : 'ভেরিফিকেশন টোকেন খুঁজে পাওয়া যায়নি।');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || (isEN ? 'Email verified successfully!' : 'ইমেইল সফলভাবে ভেরিফাই করা হয়েছে!'));
        } else {
          setStatus('error');
          setMessage(data.message || (isEN ? 'Invalid or expired token.' : 'অকার্যকর বা মেয়াদোত্তীর্ণ টোকেন।'));
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setMessage(isEN ? 'Network error. Please try again.' : 'নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।');
      }
    };

    verifyEmail();
  }, [token, isEN]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 text-center space-y-6"
      >
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">
              {isEN ? 'Verifying your email...' : 'আপনার ইমেইল ভেরিফাই করা হচ্ছে...'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isEN ? 'Please wait while we confirm your email address.' : 'অনুগ্ৰহ করে আপনার ইমেইল নিশ্চিত করার সময় অপেক্ষা করুন।'}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-slate-900">
              {isEN ? 'Email Verified!' : 'ইমেইল ভেরিফাইড!'}
            </h2>
            <p className="text-slate-600 text-sm">{message}</p>
            <button
              onClick={() => setCurrentTab('auth')}
              className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 text-sm"
            >
              {isEN ? 'Sign In Now' : 'এখনই লগইন করুন'}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-black text-slate-900">
              {isEN ? 'Verification Failed' : 'ভেরিফিকেশন ব্যর্থ হয়েছে'}
            </h2>
            <p className="text-slate-600 text-sm">{message}</p>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => setCurrentTab('auth')}
                className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 text-sm"
              >
                {isEN ? 'Go to Login' : 'লগইন পেজে যান'}
              </button>
              <button
                onClick={() => setCurrentTab('home')}
                className="w-full py-3 px-6 bg-slate-100 text-slate-700 font-semibold rounded-2xl hover:bg-slate-200 transition text-sm"
              >
                {isEN ? 'Return to Store' : 'স্টোরে ফিরে যান'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
