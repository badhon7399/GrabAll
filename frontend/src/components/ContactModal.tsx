import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerToast: (msg: string) => void;
}

export default function ContactModal({
  isOpen,
  onClose,
  triggerToast,
}: ContactModalProps) {
  const { language } = useLanguage();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    triggerToast(
      language === 'en' 
        ? 'Thank you! Your message has been sent.' 
        : 'ধন্যবাদ! আপনার বার্তাটি পাঠানো হয়েছে।'
    );
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 relative z-10 shadow-2xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary focus:outline-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h3 className="text-2xl font-bold text-deep-navy text-center mb-6">
          {language === 'en' ? 'Contact Our Team' : 'আমাদের টিমের সাথে যোগাযোগ করুন'}
        </h3>
        
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              {language === 'en' ? 'Your Name' : 'আপনার নাম'}
            </label>
            <input 
              type="text" 
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm"
              placeholder={language === 'en' ? 'John Doe' : 'যেমন: তানজিম আহমেদ'}
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1">
              {language === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'}
            </label>
            <input 
              type="email" 
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold mb-1">
              {language === 'en' ? 'Message' : 'বার্তা'}
            </label>
            <textarea 
              required
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#0088FF] focus:outline-none text-sm h-28"
              placeholder={
                language === 'en' 
                  ? 'Describe your inquiry or question...' 
                  : 'আপনার জিজ্ঞাসা বা প্রশ্নটি এখানে লিখুন...'
              }
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
              language === 'en' ? 'Send Message' : 'বার্তা পাঠান'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
