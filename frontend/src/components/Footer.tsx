import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  resetAllFilters: () => void;
  setCurrentTab: (
    tab:
      | 'home'
      | 'checkout'
      | 'orders'
      | 'success'
      | 'shop'
      | 'neck-mounts'
      | 'top-selling'
      | 'offers-deals'
      | 'new-arrival'
      | 'contact-us'
      | 'product-details'
      | 'auth'
      | 'admin',
  ) => void;
  setSelectedCategory: (cat: string) => void;
  setSortFilter: (sort: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals') => void;
}

export default function Footer({
  resetAllFilters,
  setCurrentTab,
  setSelectedCategory,
  setSortFilter,
}: FooterProps) {
  const { language, t } = useLanguage();

  const handleNavClick = (
    tab: 'home' | 'shop' | 'neck-mounts' | 'contact-us',
    category: string = 'All',
    sort: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals' = 'none',
  ) => {
    setCurrentTab(tab);
    setSelectedCategory(category);
    setSortFilter(sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks: Array<{
    label: string;
    onClick: () => void;
  }> = [
      { label: t('nav.home'), onClick: () => handleNavClick('home') },
      { label: t('nav.shop'), onClick: () => handleNavClick('shop') },
      {
        label: t('nav.neckMounts'),
        onClick: () => handleNavClick('neck-mounts', 'Neck Mounts'),
      },
      { label: t('nav.contact'), onClick: () => handleNavClick('contact-us') },
    ];

  return (
    <footer className="relative bg-gradient-to-b from-white via-white to-surface-container-low/30 border-t border-outline-variant/40 w-full pt-20 pb-10 mt-20 overflow-hidden">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0088FF]/60 to-transparent" />

      {/* Decorative ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0088FF]/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF4B7E]/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-72 bg-gradient-to-t from-[#0088FF]/5 to-transparent blur-2xl" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-container-max mx-auto w-full px-4 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 text-xs">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <button
            onClick={resetAllFilters}
            className="flex items-center self-start gap-2.5 group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0088FF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#0088FF]/30 group-hover:shadow-[#0088FF]/50 group-hover:scale-105 transition-all duration-300">
              <span className="material-symbols-outlined text-white text-[20px]">
                local_mall
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF4B7E] border-2 border-white animate-pulse" />
            </div>
            <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-on-surface group-hover:opacity-90 transition-all duration-300">
              Grab
              <span className="bg-gradient-to-r from-[#0088FF] to-[#00C2FF] bg-clip-text text-transparent">
                All
              </span>
              Goods
            </span>
          </button>

          <p className="text-on-surface-variant leading-relaxed text-[12px] max-w-sm">
            {t('footer.description')}
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2 mt-2">
            {[
              { icon: 'public', label: 'Website', color: '#0088FF' },
              { icon: 'mail', label: 'Email', color: '#FF4B7E' },
              { icon: 'chat', label: 'WhatsApp', color: '#25D366' },
              { icon: 'photo_camera', label: 'Instagram', color: '#E1306C' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-xl bg-white border border-outline-variant/50 flex items-center justify-center hover:border-transparent hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span
                  className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110"
                  style={{ color: s.color }}
                >
                  {s.icon}
                </span>
              </a>
            ))}
          </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0088FF]/8 border border-[#0088FF]/15 text-[10px] font-bold text-[#0088FF]">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            {language === 'en' ? 'Trusted' : 'বিশ্বস্ত'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/8 border border-green-500/15 text-[10px] font-bold text-green-600">
            <span className="material-symbols-outlined text-[12px]">local_shipping</span>
            {language === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4B7E]/8 border border-[#FF4B7E]/15 text-[10px] font-bold text-[#FF4B7E]">
            <span className="material-symbols-outlined text-[12px]">favorite</span>
            {language === 'en' ? 'Made for You' : 'আপনার জন্য তৈরি'}
          </span>
        </div>
      </div>

      {/* Quick Links Column */}
      <div className="md:col-span-3 flex flex-col gap-5">
        <h4 className="relative text-[11px] font-bold text-deep-navy uppercase tracking-[0.2em] pb-2">
          {t('footer.quickLinks')}
          <span className="absolute bottom-0 left-0 w-8 h-[2px] rounded-full bg-gradient-to-r from-[#0088FF] to-[#00C2FF]" />
        </h4>
        <ul className="grid grid-cols-1 gap-y-2.5 font-semibold text-on-surface-variant">
          {quickLinks.map((link) => (
            <li key={link.label}>
              <button
                onClick={link.onClick}
                className="group hover:text-[#0088FF] transition-all duration-300 flex items-center gap-2 text-[12px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/60 group-hover:bg-[#0088FF] group-hover:w-5 transition-all duration-300" />
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {link.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info / Office Column */}
      <div className="md:col-span-4 flex flex-col gap-5">
        <h4 className="relative text-[11px] font-bold text-deep-navy uppercase tracking-[0.2em] pb-2">
          {t('footer.offices')}
          <span className="absolute bottom-0 left-0 w-8 h-[2px] rounded-full bg-gradient-to-r from-[#FF4B7E] to-[#FF6B6B]" />
        </h4>

        <div className="space-y-3 font-medium text-on-surface-variant">
          <div className="group flex items-start gap-3 p-3 rounded-2xl bg-white/60 backdrop-blur border border-outline-variant/40 hover:border-[#FF4B7E]/30 hover:shadow-sm transition-all duration-300">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#FF4B7E]/10 flex items-center justify-center group-hover:bg-[#FF4B7E]/15 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-[#FF4B7E]">
                location_on
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                {language === 'en' ? 'Address' : 'ঠিকানা'}
              </p>
              <p className="text-[12px] text-deep-navy leading-relaxed font-semibold">
                {t('footer.dhakaAddr')}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-3 p-3 rounded-2xl bg-white/60 backdrop-blur border border-outline-variant/40 hover:border-[#0088FF]/30 hover:shadow-sm transition-all duration-300">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#0088FF]/10 flex items-center justify-center group-hover:bg-[#0088FF]/15 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-[#0088FF]">
                phone_iphone
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                {language === 'en' ? 'Call us' : 'আমাদের কল করুন'}
              </p>
              <p className="text-[12px] text-deep-navy font-bold tracking-wide">
                {t('footer.phone')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Footer Bottom copyright bar */ }
  <div className="max-w-container-max mx-auto w-full px-4 md:px-12 lg:px-20 mt-14 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-semibold text-on-surface-variant/80">
    <p className="text-center sm:text-left flex items-center gap-1.5">
      <span className="material-symbols-outlined text-[14px] text-[#0088FF]">
        copyright
      </span>
      {t('footer.rights')}
    </p>

    <div className="flex items-center gap-4">
      <a
        href="#"
        className="relative hover:text-[#0088FF] transition-all duration-300 group"
      >
        {language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}
        <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#0088FF] group-hover:w-full transition-all duration-300 rounded-full" />
      </a>
      <span className="w-1 h-1 rounded-full bg-outline-variant" />
      <a
        href="#"
        className="relative hover:text-[#0088FF] transition-all duration-300 group"
      >
        {language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}
        <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#0088FF] group-hover:w-full transition-all duration-300 rounded-full" />
      </a>
    </div>

    <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/70">
      <span>{language === 'en' ? 'Made with' : 'ভালোবাসা'}</span>
      <span className="material-symbols-outlined text-[12px] text-[#FF4B7E] fill-1 animate-pulse">
        favorite
      </span>
      <span>{language === 'en' ? 'in Bangladesh' : 'সহ বাংলাদেশে তৈরি'}</span>
    </div>
  </div>
    </footer >
  );
}