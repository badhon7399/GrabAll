import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ContactViewProps {
  triggerToast: (msg: string) => void;
}

export default function ContactView({ triggerToast }: ContactViewProps) {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: t('contact.faq1Q'),
      a: t('contact.faq1A')
    },
    {
      q: t('contact.faq2Q'),
      a: t('contact.faq2A')
    },
    {
      q: t('contact.faq3Q'),
      a: t('contact.faq3A')
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      triggerToast(
        language === 'en' 
          ? 'Message sent! We will contact you soon.' 
          : 'বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitting(false);
    }, 1000);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl md:text-4xl font-display-lg font-bold text-deep-navy">{t('contact.title')}</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Contact details & Office cards */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-deep-navy">
              {language === 'en' ? 'Office Addresses' : 'কার্যালয়ের ঠিকানা'}
            </h3>
            
            {/* Dhaka Office */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-[#0088FF]">
                <span className="material-symbols-outlined">location_on</span>
                <span className="font-bold text-sm text-deep-navy">{t('contact.dhaka')}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed pl-8">
                {t('contact.dhakaAddr')}
              </p>
              <div className="flex items-center gap-3 text-xs pl-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-[#FF4B7E]">call</span>
                <span>{t('contact.dhakaPhone')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs pl-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-[#FF4B7E]">mail</span>
                <span>{t('contact.dhakaEmail')}</span>
              </div>
            </div>

            {/* US Affiliate Offices */}
            <div className="bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-[#0088FF]">
                <span className="material-symbols-outlined">globe</span>
                <span className="font-bold text-sm text-deep-navy">{t('contact.usAffiliates')}</span>
              </div>
              <div className="space-y-3 pl-8 text-xs text-on-surface-variant">
                <div>
                  <p className="font-semibold text-deep-navy">
                    {language === 'en' ? 'Birmingham Office:' : 'বার্মিংহাম অফিস:'}
                  </p>
                  <p className="mt-0.5">{t('contact.usAff1')}</p>
                </div>
                <div className="border-t border-outline-variant/20 pt-3">
                  <p className="font-semibold text-deep-navy">
                    {language === 'en' ? 'Reidsville Office:' : 'রিডসভিলে অফিস:'}
                  </p>
                  <p className="mt-0.5">{t('contact.usAff2')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating hours */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 space-y-3 text-xs">
            <h4 className="font-bold text-deep-navy flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#0088FF]">schedule</span>
              {t('contact.hours')}
            </h4>
            <div className="border-b pb-1.5 mt-2 text-on-surface-variant">
              {t('contact.hoursWeek')}
            </div>
            <div className="text-on-surface-variant">
              {t('contact.hoursFri')}
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-outline-variant/35 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-deep-navy">{t('contact.formTitle')}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{t('contact.formName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Tanzim Ahmed' : 'যেমন: তানজিম আহমেদ'}
                  className="w-full px-4 py-3 border border-outline-variant/60 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{t('contact.formEmail')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-3 border border-outline-variant/60 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{t('contact.formSubject')}</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'en' ? 'How can we help you?' : 'আমরা আপনাকে কীভাবে সাহায্য করতে পারি?'}
                className="w-full px-4 py-3 border border-outline-variant/60 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{t('contact.formMsg')}</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'en' ? 'Write your details or requirements here...' : 'এখানে আপনার বিস্তারিত মতামত লিখুন...'}
                className="w-full px-4 py-3 border border-outline-variant/60 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF] resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#0088FF] text-white rounded-xl text-xs font-bold hover:bg-[#0088FF]/95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  {t('contact.formSend')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-deep-navy text-center">{t('contact.faq')}</h3>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-outline-variant/35 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center px-6 py-4.5 text-left font-bold text-deep-navy text-xs md:text-sm hover:bg-surface-container-low/30 transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-[#0088FF]' : 'text-on-surface-variant'}`}>
                  expand_more
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
