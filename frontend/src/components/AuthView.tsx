import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface AuthViewProps {
  setCurrentTab: (tab: any) => void;
  triggerToast: (msg: string) => void;
}

/* ---------- Floating Label Input ---------- */
interface FloatingFieldProps {
  icon: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  delay?: number;
}

const FloatingField: React.FC<FloatingFieldProps> = ({
  icon,
  label,
  type = 'text',
  value,
  onChange,
  required,
  delay = 0,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group mb-4"
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10">
        {icon}
      </div>
      <input
        type={inputType}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-11 pr-11 pt-6 pb-2 text-sm text-slate-800 placeholder-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 focus:outline-none transition-all duration-200"
        placeholder={label}
      />
      <label className="absolute left-11 top-2 text-[10px] font-semibold uppercase tracking-widest text-blue-500 opacity-0 peer-focus:opacity-100 peer-[&:not(:placeholder-shown)]:opacity-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal peer-placeholder-shown:opacity-100 transition-all duration-200 pointer-events-none">
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </motion.div>
  );
};

/* ---------- Animated Orb ---------- */
const Orb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={className}
    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ---------- Trust Badge ---------- */
const TrustBadge = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 text-white/80 text-sm"
  >
    <CheckCircle2 className="w-4 h-4 text-blue-300 flex-shrink-0" />
    <span>{text}</span>
  </motion.div>
);

export default function AuthView({ setCurrentTab, triggerToast }: AuthViewProps) {
  const { login, register, error: authError, clearError } = useAuth();
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEN = language === 'en';

  const switchMode = (next: 'login' | 'register' | 'forgot-password') => {
    clearError();
    setMode(next);
    setAuthName('');
    setAuthPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(authEmail, authPassword);
    setIsSubmitting(false);
    if (success) {
      triggerToast(isEN ? 'Welcome back!' : 'সফলভাবে লগইন হয়েছে!');
      setCurrentTab('home');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValid =
      authPassword.length >= 8 &&
      /[A-Z]/.test(authPassword) &&
      /[a-z]/.test(authPassword) &&
      /[0-9]/.test(authPassword);

    if (!passwordValid) {
      triggerToast(isEN
        ? 'Password must be at least 8 characters, with uppercase, lowercase, and numbers.'
        : 'পাসওয়ার্ডে কমপক্ষে ৮টি অক্ষর, একটি বড় হাতের, একটি ছোট হাতের এবং একটি সংখ্যা থাকতে হবে।');
      return;
    }

    setIsSubmitting(true);
    const success = await register(authName, authEmail, authPassword);
    setIsSubmitting(false);
    if (success) {
      triggerToast(isEN ? 'Account created!' : 'সফলভাবে রেজিস্ট্রেশন হয়েছে!');
      setCurrentTab('home');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: authEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        triggerToast(isEN ? 'Reset link sent to your email.' : 'রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে।');
        setMode('login');
      } else {
        triggerToast(data.message || (isEN ? 'Failed to send reset link.' : 'রিসেট লিঙ্ক পাঠাতে ব্যর্থ হয়েছে।'));
      }
    } catch (err) {
      console.error(err);
      triggerToast(isEN ? 'Network error. Please try again.' : 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden"
    >
      {/* Subtle page background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.06)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.05)_0%,_transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60"
        >
          {/* ===== LEFT PANEL: Hero ===== */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] min-h-[680px]">
            {/* Hero image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop"
                alt="Premium collection"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/70 to-indigo-900/80" />
            </div>

            {/* Animated orbs */}
            <Orb
              className="absolute top-16 right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"
              delay={0}
            />
            <Orb
              className="absolute bottom-24 left-8 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl"
              delay={2}
            />
            <Orb
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"
              delay={1}
            />

            {/* Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-2 mb-2"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">GearVault</span>
              </motion.div>
            </div>

            <div className="relative z-10 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
                  {isEN ? (
                    <>Premium gear,<br /><span className="text-blue-400">curated for you.</span></>
                  ) : (
                    <>সেরা পণ্য,<br /><span className="text-blue-400">আপনার জন্য।</span></>
                  )}
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  {isEN
                    ? 'Discover exclusive collections trusted by thousands of enthusiasts worldwide.'
                    : 'হাজার হাজার গ্রাহকের বিশ্বস্ত এক্সক্লুসিভ কালেকশন।'}
                </p>
              </motion.div>

              {/* Feature list */}
              <div className="space-y-3 pt-2">
                <TrustBadge text={isEN ? 'Free express shipping on all orders' : 'সকল অর্ডারে ফ্রি ডেলিভারি'} delay={0.55} />
                <TrustBadge text={isEN ? 'Secure checkout & data protection' : 'নিরাপদ পেমেন্ট ও তথ্য সুরক্ষা'} delay={0.65} />
                <TrustBadge text={isEN ? '30-day hassle-free returns' : '৩০ দিনের রিটার্ন পলিসি'} delay={0.75} />
              </div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-3 pt-2"
              >
                <div className="flex -space-x-2">
                  {['https://i.pravatar.cc/32?img=1', 'https://i.pravatar.cc/32?img=5', 'https://i.pravatar.cc/32?img=9', 'https://i.pravatar.cc/32?img=14'].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" />
                  ))}
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">50,000+ customers</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32-3.87-3.77 5.34-.78z" /></svg>
                    ))}
                    <span className="text-slate-400 text-xs ml-1">4.9/5</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ===== RIGHT PANEL: Form ===== */}
          <div className="relative bg-white flex flex-col justify-center px-8 py-12 md:px-12 min-h-[680px]">
            {/* Mode tabs */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex bg-slate-100 rounded-2xl p-1 mb-8"
            >
              {mode === 'forgot-password' ? (
                <button
                  onClick={() => switchMode('login')}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-white text-slate-900 shadow-sm shadow-slate-200 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  &larr; {isEN ? 'Back to Sign In' : 'লগইন পেজে ফিরুন'}
                </button>
              ) : (
                (['login', 'register'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${mode === m
                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {m === 'login'
                      ? isEN ? 'Sign In' : 'লগইন'
                      : isEN ? 'Create Account' : 'রেজিস্টার'}
                  </button>
                ))
              )}
            </motion.div>

            {/* Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + 'header'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mb-7"
              >
                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {mode === 'login'
                    ? isEN ? 'Welcome back 👋' : 'স্বাগতম 👋'
                    : mode === 'register'
                    ? isEN ? 'Join thousands of shoppers' : 'যোগ দিন আমাদের সাথে'
                    : isEN ? 'Trouble signing in? 🔑' : 'লগইন সমস্যা? 🔑'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {mode === 'login'
                    ? isEN ? 'Sign in to access your account.' : 'আপনার অ্যাকাউন্টে প্রবেশ করুন।'
                    : mode === 'register'
                    ? isEN ? 'Create an account — it only takes a minute.' : 'মাত্র এক মিনিটে অ্যাকাউন্ট তৈরি করুন।'
                    : isEN ? 'Enter your email to receive a password reset link.' : 'পাসওয়ার্ড রিসেট লিঙ্ক পেতে আপনার ইমেইল ঠিকানাটি লিখুন।'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-sm font-medium"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                  {authError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLoginSubmit}
                >
                  <FloatingField
                    icon={<Mail className="w-4 h-4" />}
                    label={isEN ? 'Email Address' : 'ইমেইল ঠিকানা'}
                    type="email"
                    value={authEmail}
                    onChange={setAuthEmail}
                    required
                    delay={0.05}
                  />
                  <FloatingField
                    icon={<Lock className="w-4 h-4" />}
                    label={isEN ? 'Password' : 'পাসওয়ার্ড'}
                    type="password"
                    value={authPassword}
                    onChange={setAuthPassword}
                    required
                    delay={0.1}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-end mb-6"
                  >
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      {isEN ? 'Forgot password?' : 'পাসওয়ার্ড ভুলে গেছেন?'}
                    </button>
                  </motion.div>

                  <SubmitButton isSubmitting={isSubmitting} label={isEN ? 'Sign In' : 'লগইন করুন'} gradient="from-blue-600 to-indigo-600" shadow="blue-500/25" />
                </motion.form>
              ) : mode === 'register' ? (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleRegisterSubmit}
                >
                  <FloatingField
                    icon={<User className="w-4 h-4" />}
                    label={isEN ? 'Full Name' : 'পুরো নাম'}
                    value={authName}
                    onChange={setAuthName}
                    required
                    delay={0.05}
                  />
                  <FloatingField
                    icon={<Mail className="w-4 h-4" />}
                    label={isEN ? 'Email Address' : 'ইমেইল ঠিকানা'}
                    type="email"
                    value={authEmail}
                    onChange={setAuthEmail}
                    required
                    delay={0.1}
                  />
                  <FloatingField
                    icon={<Lock className="w-4 h-4" />}
                    label={isEN ? 'Password' : 'পাসওয়ার্ড'}
                    type="password"
                    value={authPassword}
                    onChange={setAuthPassword}
                    required
                    delay={0.15}
                  />
                  <div className="mb-6" />
                  <SubmitButton isSubmitting={isSubmitting} label={isEN ? 'Create Account' : 'রেজিস্টার করুন'} gradient="from-indigo-600 to-purple-600" shadow="indigo-500/25" />
                </motion.form>
              ) : (
                <motion.form
                  key="forgot-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleForgotPasswordSubmit}
                >
                  <FloatingField
                    icon={<Mail className="w-4 h-4" />}
                    label={isEN ? 'Email Address' : 'ইমেইল ঠিকানা'}
                    type="email"
                    value={authEmail}
                    onChange={setAuthEmail}
                    required
                    delay={0.05}
                  />
                  <div className="mb-6" />
                  <SubmitButton isSubmitting={isSubmitting} label={isEN ? 'Send Reset Link' : 'রিসেট লিঙ্ক পাঠান'} gradient="from-blue-600 to-indigo-600" shadow="blue-500/25" />
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs font-medium">{isEN ? 'or' : 'অথবা'}</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Google SSO (visual only — wire up as needed) */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isEN ? 'Continue with Google' : 'Google দিয়ে চালিয়ে যান'}
            </motion.button>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center text-xs text-slate-400"
            >
              {isEN ? 'By continuing, you agree to our ' : 'চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের '}
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                {isEN ? 'Terms' : 'শর্তাবলী'}
              </span>
              {isEN ? ' and ' : ' এবং '}
              <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                {isEN ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
              </span>
              {isEN ? '.' : 'তে সম্মত হচ্ছেন।'}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ---------- Submit Button ---------- */
function SubmitButton({ isSubmitting, label, gradient, shadow }: { isSubmitting: boolean; label: string; gradient: string; shadow: string }) {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full relative px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} shadow-lg shadow-${shadow} hover:shadow-xl disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 group overflow-hidden text-sm`}
    >
      {/* shimmer */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      {isSubmitting ? (
        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </>
      )}
    </motion.button>
  );
}