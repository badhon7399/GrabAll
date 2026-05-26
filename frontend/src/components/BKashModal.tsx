import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, ArrowRight, Smartphone, Key, CircleDot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BKashModalProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function BKashModal({ orderId, amount, onSuccess, onClose }: BKashModalProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 'processing' | 'success'>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^01[3-9]\d{8}$/.test(phoneNumber)) {
      setError(
        language === 'en'
          ? 'Please enter a valid 11-digit bKash number (e.g., 017XXXXXXXX)'
          : 'সঠিক ১১-সংখ্যার বিকাশ নম্বরটি লিখুন (যেমন, ০১৭XXXXXXXX)'
      );
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError(language === 'en' ? 'OTP must be 6 digits' : 'ওটিপি অবশ্যই ৬ সংখ্যার হতে হবে');
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError(language === 'en' ? 'PIN must be at least 4 digits' : 'পিন অবশ্যই কমপক্ষে ৪ সংখ্যার হতে হবে');
      return;
    }
    setError('');
    setStep('processing');

    try {
      // Simulate API call to mark order as paid
      const response = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setTimeout(() => {
          setStep('success');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }, 2000);
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (err) {
      setError(language === 'en' ? 'Payment processing failed. Please try again.' : 'পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      setStep(3);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
        >
          {/* Header (bKash Style) */}
          <div className="bg-[#E2125B] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-md">
                <img
                  src="https://logos-download.com/wp-content/uploads/2022/01/BKash_Logo.png"
                  alt="bKash Logo"
                  className="h-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">
                  {language === 'en' ? 'bKash Checkout' : 'বিকাশ চেকআউট'}
                </h3>
                <p className="text-[10px] text-white/80 uppercase tracking-widest font-semibold">
                  {language === 'en' ? 'Secure Payment Gateway' : 'নিরাপদ পেমেন্ট গেটওয়ে'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-end">
              <div>
                <span className="text-xs text-white/70 block">
                  {language === 'en' ? 'Merchant' : 'মার্চেন্ট'}
                </span>
                <span className="font-bold text-sm">GrabAll E-Commerce</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-white/70 block">
                  {language === 'en' ? 'Amount' : 'পরিমাণ'}
                </span>
                <span className="text-xl font-black">৳ {amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 bg-slate-50/50">
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePhoneSubmit}
                className="space-y-5"
              >
                <div className="text-center mb-2">
                  <Smartphone className="w-12 h-12 text-[#E2125B] mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-base">
                    {language === 'en' ? 'Enter bKash Account Number' : 'বিকাশ অ্যাকাউন্ট নম্বর দিন'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'en'
                      ? 'Enter the bKash wallet number you wish to pay with'
                      : 'যে বিকাশ নম্বরটি থেকে পেমেন্ট করতে চান তা লিখুন'}
                  </p>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    +88
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-14 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold tracking-wide outline-none focus:border-[#E2125B] focus:ring-4 focus:ring-[#E2125B]/5 transition shadow-sm"
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#E2125B] text-white font-bold text-sm hover:bg-[#c90f50] active:scale-[0.98] transition shadow-lg shadow-[#E2125B]/25 flex items-center justify-center gap-2"
                >
                  {language === 'en' ? 'Send Verification Code' : 'ভেরিফিকেশন কোড পাঠান'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleOtpSubmit}
                className="space-y-5"
              >
                <div className="text-center mb-2">
                  <Key className="w-12 h-12 text-[#E2125B] mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-base">
                    {language === 'en' ? 'Enter Verification Code' : 'ভেরিফিকেশন কোড দিন'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'en'
                      ? `We've simulated sending a 6-digit OTP to +88${phoneNumber}`
                      : `আমরা +88${phoneNumber} নম্বরে একটি ৬-সংখ্যার ওটিপি পাঠিয়েছি`}
                  </p>
                </div>

                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------"
                  className="w-full text-center py-3.5 bg-white border border-slate-200 rounded-2xl text-xl font-bold tracking-[0.7em] pl-[0.7em] outline-none focus:border-[#E2125B] focus:ring-4 focus:ring-[#E2125B]/5 transition shadow-sm"
                />

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    {language === 'en' ? "Didn't receive code?" : 'কোড পাননি?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#E2125B] font-bold hover:underline"
                  >
                    {language === 'en' ? 'Resend / Change Number' : 'পুনরায় পাঠান / নম্বর পরিবর্তন'}
                  </button>
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#E2125B] text-white font-bold text-sm hover:bg-[#c90f50] active:scale-[0.98] transition shadow-lg shadow-[#E2125B]/25 flex items-center justify-center gap-2"
                >
                  {language === 'en' ? 'Verify Code' : 'কোড যাচাই করুন'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handlePinSubmit}
                className="space-y-5"
              >
                <div className="text-center mb-2">
                  <Lock className="w-12 h-12 text-[#E2125B] mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-base">
                    {language === 'en' ? 'Enter bKash PIN' : 'বিকাশ পিন নম্বর দিন'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'en'
                      ? 'Securely enter your bKash account PIN'
                      : 'নিরাপদে আপনার বিকাশ পিন লিখুন'}
                  </p>
                </div>

                <input
                  type="password"
                  required
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="•••••"
                  className="w-full text-center py-3.5 bg-white border border-slate-200 rounded-2xl text-2xl font-bold tracking-[0.5em] pl-[0.5em] outline-none focus:border-[#E2125B] focus:ring-4 focus:ring-[#E2125B]/5 transition shadow-sm"
                />

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#E2125B] text-white font-bold text-sm hover:bg-[#c90f50] active:scale-[0.98] transition shadow-lg shadow-[#E2125B]/25 flex items-center justify-center gap-2"
                >
                  {language === 'en' ? 'Confirm Payment' : 'পেমেন্ট নিশ্চিত করুন'}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </motion.form>
            )}

            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-full border-4 border-[#E2125B]/20 border-t-[#E2125B] rounded-full"
                  />
                  <CircleDot className="w-6 h-6 text-[#E2125B] absolute inset-0 m-auto animate-pulse" />
                </div>
                <h4 className="font-bold text-slate-800">
                  {language === 'en' ? 'Processing Payment...' : 'পেমেন্ট প্রসেস হচ্ছে...'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Please do not close or refresh this page.' : 'অনুগ্রহ করে এই পৃষ্ঠাটি বন্ধ বা রিফ্রেশ করবেন না।'}
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10 space-y-4"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-emerald-600 text-lg">
                  {language === 'en' ? 'Payment Successful' : 'পেমেন্ট সম্পন্ন হয়েছে'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Your payment has been secure verified.' : 'আপনার পেমেন্টটি নিরাপদে ভেরিফাই করা হয়েছে।'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer (Safe badge) */}
          <div className="bg-slate-100 p-4 text-center border-t border-slate-200/50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-slate-400" />{' '}
            {language === 'en' ? 'Secure SSL 256-bit Encryption' : 'নিরাপদ এসএসএল ২৫৬-বিট এনক্রিপশন'}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
