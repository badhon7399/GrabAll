import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();
  const isEN = language === 'en';

  useEffect(() => {
    const consent = localStorage.getItem('graball_cookie_consent');
    if (!consent) {
      // Delay showing the banner for a smoother entrance
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('graball_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('graball_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-8 duration-500 text-xs">
      <div className="relative bg-white/80 backdrop-blur-md border border-outline-variant/40 shadow-2xl shadow-black/10 rounded-2xl p-5 md:p-6 flex flex-col gap-4">
        {/* Decorative accent top boundary */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#0088FF] to-[#00C2FF]" />

        <div className="flex gap-3 items-start mt-1">
          <div className="w-10 h-10 rounded-xl bg-[#0088FF]/10 flex items-center justify-center text-[#0088FF] shrink-0">
            <span className="material-symbols-outlined text-[20px]">cookie</span>
          </div>
          <div>
            <h4 className="font-bold text-deep-navy text-[13px] tracking-tight">
              {isEN ? 'Cookie Settings' : 'কুকি সেটিংস'}
            </h4>
            <p className="text-on-surface-variant text-[11px] leading-relaxed mt-1">
              {isEN 
                ? 'We use cookies to secure your shopping session and deliver the best user experience. By accepting, you consent to our use of cookies.' 
                : 'আমরা আপনার শপিং সেশন সুরক্ষিত রাখতে এবং উন্নত অভিজ্ঞতা প্রদানের জন্য কুকি ব্যবহার করি। আমাদের নীতি মেনে নিতে সম্মত হোন।'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end font-semibold text-[11px]">
          <button 
            onClick={handleDecline}
            className="px-3.5 py-2 border rounded-xl hover:bg-surface-container-low transition-colors duration-300 text-on-surface-variant cursor-pointer"
          >
            {isEN ? 'Decline' : 'প্রত্যাখ্যান'}
          </button>
          <button 
            onClick={handleAccept}
            className="px-4 py-2 bg-gradient-to-r from-[#0088FF] to-[#00C2FF] hover:opacity-95 text-white rounded-xl shadow-md shadow-[#0088FF]/20 transition-all duration-300 cursor-pointer"
          >
            {isEN ? 'Accept All' : 'সব গ্রহণ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
