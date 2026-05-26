import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Lock, Eye, EyeOff, XCircle, ArrowRight } from 'lucide-react';

interface ResetPasswordViewProps {
  setCurrentTab: (tab: any) => void;
  triggerToast: (msg: string) => void;
}

export default function ResetPasswordView({ setCurrentTab, triggerToast }: ResetPasswordViewProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { language } = useLanguage();
  const isEN = language === 'en';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  // Password rules validation helper
  const getValidationRules = () => {
    return [
      { text: isEN ? 'At least 8 characters' : 'কমপক্ষে ৮টি অক্ষর', valid: password.length >= 8 },
      { text: isEN ? 'Contains uppercase letter' : 'বড় হাতের অক্ষর', valid: /[A-Z]/.test(password) },
      { text: isEN ? 'Contains lowercase letter' : 'ছোট হাতের অক্ষর', valid: /[a-z]/.test(password) },
      { text: isEN ? 'Contains number' : 'সংখ্যা', valid: /[0-9]/.test(password) },
    ];
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage(isEN ? 'Reset token is missing.' : 'রিসেট টোকেন পাওয়া যায়নি।');
      setStatus('error');
      return;
    }

    const rules = getValidationRules();
    if (rules.some(r => !r.valid)) {
      triggerToast(isEN ? 'Password does not meet safety requirements.' : 'পাসওয়ার্ড নিরাপত্তা শর্তাবলী পূরণ করেনি।');
      return;
    }

    if (password !== confirmPassword) {
      triggerToast(isEN ? 'Passwords do not match.' : 'পাসওয়ার্ড দুটি মেলেনি।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        triggerToast(isEN ? 'Password reset successfully!' : 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      } else {
        setErrorMessage(data.message || (isEN ? 'Reset request failed.' : 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।'));
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(isEN ? 'Network error. Please try again.' : 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 space-y-6"
      >
        {status === 'form' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEN ? 'Reset Password' : 'পাসওয়ার্ড রিসেট'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isEN ? 'Create a secure new password for your account.' : 'আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড লিখুন।'}
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4">
              {/* New Password */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-11 pr-11 pt-6 pb-2 text-sm text-slate-800 placeholder-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none transition-all duration-200"
                  placeholder={isEN ? 'New Password' : 'নতুন পাসওয়ার্ড'}
                />
                <label className="absolute left-11 top-2 text-[10px] font-semibold uppercase tracking-widest text-blue-500 opacity-0 peer-focus:opacity-100 peer-[&:not(:placeholder-shown)]:opacity-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal peer-placeholder-shown:opacity-100 transition-all duration-200 pointer-events-none">
                  {isEN ? 'New Password' : 'নতুন পাসওয়ার্ড'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="peer w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-11 pr-11 pt-6 pb-2 text-sm text-slate-800 placeholder-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none transition-all duration-200"
                  placeholder={isEN ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন'}
                />
                <label className="absolute left-11 top-2 text-[10px] font-semibold uppercase tracking-widest text-blue-500 opacity-0 peer-focus:opacity-100 peer-[&:not(:placeholder-shown)]:opacity-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal peer-placeholder-shown:opacity-100 transition-all duration-200 pointer-events-none">
                  {isEN ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন'}
                </label>
              </div>

              {/* Password complexity checklist */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {isEN ? 'Security Guidelines' : 'নিরাপত্তা নির্দেশিকা'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {getValidationRules().map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${r.valid ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={r.valid ? 'text-slate-700 font-semibold' : 'text-slate-400'}>
                        {r.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full relative py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-xl disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 group overflow-hidden text-sm"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isEN ? 'Update Password' : 'পাসওয়ার্ড আপডেট করুন'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-black text-slate-900">
              {isEN ? 'Password Updated!' : 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isEN ? 'You can now sign in using your new password.' : 'আপনি এখন নতুন পাসওয়ার্ড ব্যবহার করে লগইন করতে পারবেন।'}
            </p>
            <button
              onClick={() => setCurrentTab('auth')}
              className="w-full mt-4 py-3 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 text-sm"
            >
              {isEN ? 'Sign In' : 'লগইন করুন'}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
            <h2 className="text-2xl font-black text-slate-900">
              {isEN ? 'Reset Failed' : 'রিসেট ব্যর্থ হয়েছে'}
            </h2>
            <p className="text-slate-600 text-sm">{errorMessage}</p>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => setStatus('form')}
                className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 text-sm"
              >
                {isEN ? 'Try Again' : 'আবার চেষ্টা করুন'}
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
