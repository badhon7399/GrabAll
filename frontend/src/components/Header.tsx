import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentTab: string;
  selectedCategory: string;
  sortFilter: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals';
  searchKeyword: string;
  setSearchKeyword: (s: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  resetAllFilters: () => void;
  setSelectedCategory: (s: string) => void;
  setSortFilter: (s: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals') => void;
  setCurrentTab: (
    t:
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
  wishlistCount: number;
  setIsWishlistOpen: (b: boolean) => void;
  setIsCartOpen: (b: boolean) => void;
  handleViewOrders: () => void;
  products?: any[];
  setDetailsProduct?: (p: any) => void;
  detailsProduct?: any;
}

export default function Header({
  currentTab,
  selectedCategory,
  sortFilter,
  searchKeyword,
  setSearchKeyword,
  handleSearchSubmit,
  resetAllFilters,
  setSelectedCategory,
  setSortFilter,
  setCurrentTab,
  wishlistCount,
  setIsWishlistOpen,
  setIsCartOpen,
  handleViewOrders,
  products = [],
  setDetailsProduct,
  detailsProduct,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { language, setLanguage, t } = useLanguage();

  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const mobileUserDropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node) &&
        (!mobileUserDropdownRef.current || !mobileUserDropdownRef.current.contains(event.target as Node))
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        (!mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(event.target as Node))
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
      setIsSearchFocused(true);
    } else {
      setIsSearchFocused(false);
    }
  }, [isSearchExpanded]);

  // Subtle elevation effect on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shopCategories = ['Content Gear', 'Microphones', 'Power Banks', 'Neck Mounts', 'Smart Finder'];

  const navLinkBase =
    'relative text-[13px] font-semibold py-2 px-1 transition-all duration-300 group';

  const renderUnderline = (active: boolean) => (
    <span
      className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-[#0088FF] to-[#00C2FF] transition-all duration-500 ${active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
        }`}
    />
  );

  const [logo, setLogo] = useState(() => {
    try {
      const stored = localStorage.getItem('grabAllLogo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [announcements, setAnnouncements] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('grabAllAnnouncements');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      '🚚 Free Shipping over 4,000 BDT',
      '🎁 Buy 2 Get 10% Off — Code: CREATOR10',
      '⚡ Flash Sale Ends Soon',
      '🛡️ 7-Day Easy Returns',
      '💬 24/7 Creator Support'
    ];
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('grabAllLogo');
        setLogo(stored ? JSON.parse(stored) : null);
      } catch {}
      try {
        const storedAnn = localStorage.getItem('grabAllAnnouncements');
        if (storedAnn) {
          const parsed = JSON.parse(storedAnn);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
          }
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 w-full flex flex-col">
      {/* Top Announcement Bar */}
      <div
        className={`bg-deep-navy text-white text-[12px] tracking-wider overflow-hidden transition-all duration-500 ease-in-out ${
          isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <motion.div
          className="flex gap-12 whitespace-nowrap py-2"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12">
              {announcements.map((ann, idx) => (
                <span key={idx}>{ann}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Top Header */}
      <header
        className={`flex flex-col md:hidden w-full px-4 py-2 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-b border-outline-variant/40'
            : 'bg-white/90 backdrop-blur-md border-b border-outline-variant/30'
        }`}
      >
        <div className="flex items-center justify-between py-1 gap-4">
          {/* Logo */}
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-2 group focus:outline-none"
          >
            {logo?.url ? (
              <img
                src={logo.url}
                alt={logo.storeName || 'Logo'}
                width={120}
                height={32}
                className="h-8 w-auto max-w-[120px] object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#0088FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-[16px]">
                  local_mall
                </span>
              </div>
            )}
            <span className="text-lg font-bold font-display tracking-tight text-on-surface">
              {logo?.storeName ? (
                logo.storeName
              ) : (
                <>
                  Grab
                  <span className="bg-gradient-to-r from-[#0088FF] to-[#00C2FF] bg-clip-text text-transparent">
                    All
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Right actions: Language Switcher, Cart Icon */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2.5 py-1.5 text-[10px] font-bold border border-outline-variant/60 rounded-full bg-white flex items-center gap-1 text-deep-navy shadow-sm"
              title={language === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}
            >
              <span className="material-symbols-outlined text-[12px] text-[#0088FF]">
                language
              </span>
              <span>{language === 'en' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-full relative flex items-center justify-center"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-[22px] text-[#FF4B7E]">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-[#0088FF] to-[#00C2FF] text-white text-[9px] font-bold h-[16px] min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-md shadow-[#0088FF]/40">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div className="py-1 w-full relative" ref={mobileSearchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full">
            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-24 py-2 bg-slate-100/80 border border-slate-200/60 rounded-full text-[12px] focus:outline-none focus:ring-2 focus:ring-[#0088FF]/40 focus:border-[#0088FF] focus:bg-white transition-all"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-20 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-[#0088FF] to-[#00C2FF] text-white text-[11px] font-bold rounded-full hover:opacity-95 transition-opacity"
            >
              {language === 'en' ? 'Search' : 'খুঁজুন'}
            </button>
          </form>

          {/* Autocomplete for Mobile */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col p-4">
              {/* Popular / Recent Searches */}
              {!searchKeyword.trim() ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Popular Searches' : 'জনপ্রিয় অনুসন্ধান'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Neck Mount', 'Microphone', 'Gimbal', 'Audio'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchKeyword(tag);
                            setTimeout(() => {
                              handleSearchSubmit({ preventDefault: () => {} } as any);
                              setIsSearchFocused(false);
                            }, 50);
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#0088FF]/10 text-slate-600 hover:text-[#0088FF] text-[10px] font-medium rounded-full border border-slate-100 hover:border-[#0088FF]/30 transition-all"
                        >
                          🔍 {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'en' ? 'Shop Categories' : 'ক্যাটাগরি সমূহ'}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { name: language === 'en' ? 'Neck Mounts' : 'নেক মাউন্টস', tab: 'neck-mounts', cat: 'Neck Mounts' },
                        { name: language === 'en' ? 'Microphones' : 'মাইক্রোফোন', tab: 'shop', cat: 'Microphones' },
                        { name: language === 'en' ? 'All Products' : 'সব পণ্য', tab: 'shop', cat: 'All' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(item.cat);
                            setSortFilter('none');
                            setCurrentTab(item.tab as any);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-100 transition-all text-left"
                        >
                          <span className="material-symbols-outlined text-xs text-[#0088FF]">grid_view</span>
                          <span className="text-[10px] font-semibold text-slate-700">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Results Preview
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === 'en' ? 'Matching Products' : 'মিল থাকা পণ্য'}
                    </h4>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {(() => {
                        const q = searchKeyword.toLowerCase();
                        const matches = (products || []).filter((prod) =>
                          (prod.name || '').toLowerCase().includes(q) ||
                          (prod.category || '').toLowerCase().includes(q)
                        );
                        return matches.length;
                      })()} {language === 'en' ? 'results' : 'টি পণ্য'}
                    </span>
                  </div>

                  {(() => {
                    const q = searchKeyword.toLowerCase();
                    const matches = (products || []).filter((prod) =>
                      (prod.name || '').toLowerCase().includes(q) ||
                      (prod.category || '').toLowerCase().includes(q)
                    );

                    if (matches.length === 0) {
                      return (
                        <div className="text-center py-4 flex flex-col items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-2xl mb-1">search_off</span>
                          <p className="text-[10px] font-semibold">
                            {language === 'en'
                              ? `No products found`
                              : `পণ্য পাওয়া যায়নি`}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {matches.slice(0, 4).map((prod) => (
                          <div
                            key={prod._id}
                            onClick={() => {
                              if (setDetailsProduct) {
                                setDetailsProduct(prod);
                                setCurrentTab('product-details');
                              }
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all group"
                          >
                            <img
                              src={prod.image || 'https://raw.githubusercontent.com/shadcn.png'}
                              alt={prod.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[10px] font-bold text-slate-800 truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[9px] text-slate-400 truncate mt-0.5">{prod.category}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-800">৳{prod.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className={`hidden md:flex w-full justify-center px-4 md:px-12 lg:px-20 transition-all duration-500 ${isScrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border-b border-outline-variant/40'
            : 'bg-white/70 backdrop-blur-md border-b border-outline-variant/30'
          }`}
      >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0088FF]/40 to-transparent" />

      <div className="w-full max-w-container-max flex items-center justify-between py-3.5">
        {/* Logo */}
        <button
          onClick={resetAllFilters}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          {logo?.url ? (
            <img
              src={logo.url}
              alt={logo.storeName || 'Logo'}
              width={150}
              height={36}
              className="h-9 w-auto max-w-[150px] object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#0088FF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#0088FF]/25 group-hover:shadow-[#0088FF]/40 group-hover:scale-105 transition-all duration-300">
              <span className="material-symbols-outlined text-white text-[18px]">
                local_mall
              </span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#FF4B7E] border-2 border-white animate-pulse" />
            </div>
          )}
          <span className="text-xl md:text-2xl font-bold font-display tracking-tight text-on-surface group-hover:opacity-90 transition-all duration-300">
            {logo?.storeName ? (
              logo.storeName
            ) : (
              <>
                Grab
                <span className="bg-gradient-to-r from-[#0088FF] to-[#00C2FF] bg-clip-text text-transparent">
                  All
                </span>
                Goods
              </>
            )}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {/* Home */}
          <button
            onClick={resetAllFilters}
            className={`${navLinkBase} ${currentTab === 'home' && sortFilter === 'none' && selectedCategory === 'All'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            {t('nav.home')}
            {renderUnderline(
              currentTab === 'home' && sortFilter === 'none' && selectedCategory === 'All',
            )}
          </button>

          {/* Shop Dropdown */}
          <div className="relative" ref={shopDropdownRef}>
            <button
              onClick={() => {
                setCurrentTab('shop');
                setSelectedCategory('All');
                setSortFilter('none');
                setIsShopDropdownOpen(!isShopDropdownOpen);
              }}
              className={`${navLinkBase} flex items-center gap-0.5 ${currentTab === 'shop' || isShopDropdownOpen
                  ? 'text-[#0088FF]'
                  : 'text-on-surface-variant hover:text-deep-navy'
                }`}
            >
              {t('nav.shop')}
              <span
                className={`material-symbols-outlined text-lg transition-all duration-300 ${isShopDropdownOpen
                    ? 'rotate-180 text-[#0088FF]'
                    : 'text-on-surface-variant group-hover:text-deep-navy'
                  }`}
              >
                expand_more
              </span>
              {renderUnderline(currentTab === 'shop' || isShopDropdownOpen)}
            </button>

            {isShopDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-72 bg-white/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                {/* Decorative gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0088FF] via-[#00C2FF] to-[#FF4B7E]" />

                <div className="px-5 py-2 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.18em]">
                    {t('cat.title')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF] animate-pulse" />
                </div>

                {shopCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSortFilter('none');
                      setCurrentTab('shop');
                      setIsShopDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 mx-0 hover:bg-gradient-to-r hover:from-[#0088FF]/8 hover:to-transparent text-[13px] font-medium text-on-surface hover:text-[#0088FF] transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-[#0088FF] group-hover:w-4 transition-all duration-300" />
                      {t(
                        cat === 'Content Gear'
                          ? 'cat.contentGear'
                          : cat === 'Microphones'
                            ? 'cat.microphones'
                            : cat === 'Power Banks'
                              ? 'cat.powerBanks'
                              : cat === 'Neck Mounts'
                                ? 'cat.neckMounts'
                                : 'cat.smartFinder',
                      )}
                    </span>
                    <span className="material-symbols-outlined text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0088FF]">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Top Selling */}
          <button
            onClick={() => {
              setSortFilter('top-selling');
              setSelectedCategory('All');
              setCurrentTab('top-selling');
            }}
            className={`${navLinkBase} ${currentTab === 'top-selling'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            {t('nav.topSelling')}
            {renderUnderline(currentTab === 'top-selling')}
          </button>

          {/* Neck Mounts */}
          <button
            onClick={() => {
              setSelectedCategory('Neck Mounts');
              setSortFilter('none');
              setCurrentTab('neck-mounts');
            }}
            className={`${navLinkBase} ${currentTab === 'neck-mounts'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            {t('nav.neckMounts')}
            {renderUnderline(currentTab === 'neck-mounts')}
          </button>

          {/* Offers & Deals */}
          <button
            onClick={() => {
              setSortFilter('offers-deals');
              setSelectedCategory('All');
              setCurrentTab('offers-deals');
            }}
            className={`${navLinkBase} flex items-center gap-1 ${currentTab === 'offers-deals'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#FF4B7E]">
              local_fire_department
            </span>
            {t('nav.offersDeals')}
            {renderUnderline(currentTab === 'offers-deals')}
          </button>

          {/* New Arrival */}
          <button
            onClick={() => {
              setSortFilter('new-arrival');
              setSelectedCategory('All');
              setCurrentTab('new-arrival');
            }}
            className={`${navLinkBase} ${currentTab === 'new-arrival'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            {t('nav.newArrival')}
            <span className="absolute -top-1 -right-3 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF4B7E] to-[#FF6B6B] text-white shadow-sm">
              NEW
            </span>
            {renderUnderline(currentTab === 'new-arrival')}
          </button>

          {/* My Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className={`${navLinkBase} text-on-surface-variant hover:text-deep-navy flex items-center gap-1.5`}
          >
            {t('nav.wishlist')}
            {wishlistCount > 0 && (
              <span className="bg-gradient-to-br from-[#FF4B7E] to-[#FF6B6B] text-white text-[10px] font-bold h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-sm shadow-[#FF4B7E]/40 animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Contact Us */}
          <button
            onClick={() => setCurrentTab('contact-us')}
            className={`${navLinkBase} ${currentTab === 'contact-us'
                ? 'text-[#0088FF]'
                : 'text-on-surface-variant hover:text-deep-navy'
              }`}
          >
            {t('nav.contact')}
            {renderUnderline(currentTab === 'contact-us')}
          </button>
        </nav>

        {/* Right-side Controls */}
        <div className="flex items-center gap-2 md:gap-3 relative">
          {/* Expanding Search Bar */}
          <div className="flex items-center relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('nav.searchPlaceholder')}
                className={`py-2 bg-surface-container-low/60 backdrop-blur border border-outline-variant/60 rounded-full text-[12px] transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-[#0088FF]/40 focus:border-[#0088FF] focus:bg-white ${isSearchExpanded
                    ? 'w-64 md:w-80 px-4 pr-9 opacity-100'
                    : 'w-0 px-0 opacity-0 pointer-events-none'
                  }`}
              />
              {isSearchExpanded && searchKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchKeyword('');
                  }}
                  className="absolute right-10 p-1 rounded-full text-on-surface-variant hover:text-deep-navy hover:bg-outline-variant/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${isSearchExpanded
                    ? 'bg-[#0088FF] text-white shadow-md shadow-[#0088FF]/30 -ml-9 relative z-10'
                    : 'hover:bg-surface-container-low text-on-surface'
                  }`}
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </form>

            {/* Advanced Search Autocomplete Dropdown */}
            {isSearchExpanded && isSearchFocused && (
              <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Popular / Recent Searches */}
                {!searchKeyword.trim() ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {language === 'en' ? 'Popular Searches' : 'জনপ্রিয় অনুসন্ধান'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Neck Mount', 'Microphone', 'Gimbal', 'Audio'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSearchKeyword(tag);
                              // Auto trigger filter update in App.tsx by simulating a form submission
                              setTimeout(() => {
                                const event = new Event('submit', { cancelable: true });
                                searchInputRef.current?.form?.dispatchEvent(event);
                              }, 50);
                              setIsSearchFocused(false);
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-[#0088FF]/10 text-slate-600 hover:text-[#0088FF] text-[11px] font-medium rounded-full border border-slate-100 hover:border-[#0088FF]/30 transition-all"
                          >
                            🔍 {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {language === 'en' ? 'Shop Categories' : 'ক্যাটাগরি সমূহ'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: language === 'en' ? 'Neck Mounts' : 'নেক মাউন্টস', tab: 'neck-mounts', cat: 'Neck Mounts' },
                          { name: language === 'en' ? 'Microphones' : 'মাইক্রোফোন', tab: 'shop', cat: 'Microphones' },
                          { name: language === 'en' ? 'All Products' : 'সব পণ্য', tab: 'shop', cat: 'All' },
                        ].map((item) => (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(item.cat);
                              setSortFilter('none');
                              setCurrentTab(item.tab as any);
                              setIsSearchFocused(false);
                              setIsSearchExpanded(false);
                            }}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-100 transition-all text-left"
                          >
                            <span className="material-symbols-outlined text-sm text-[#0088FF]">grid_view</span>
                            <span className="text-[11px] font-semibold text-slate-700">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Results Preview
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'en' ? 'Matching Products' : 'মিল থাকা পণ্য'}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(() => {
                          const q = searchKeyword.toLowerCase();
                          const matches = (products || []).filter((prod) =>
                            (prod.name || '').toLowerCase().includes(q) ||
                            (prod.category || '').toLowerCase().includes(q) ||
                            (prod.description || '').toLowerCase().includes(q)
                          );
                          return matches.length;
                        })()} {(() => {
                          const q = searchKeyword.toLowerCase();
                          const matches = (products || []).filter((prod) =>
                            (prod.name || '').toLowerCase().includes(q) ||
                            (prod.category || '').toLowerCase().includes(q) ||
                            (prod.description || '').toLowerCase().includes(q)
                          );
                          if (language === 'en') {
                            return matches.length === 1 ? 'result' : 'results';
                          } else {
                            return 'টি পণ্য';
                          }
                        })()}
                      </span>
                    </div>

                    {(() => {
                      const q = searchKeyword.toLowerCase();
                      const matches = (products || []).filter((prod) =>
                        (prod.name || '').toLowerCase().includes(q) ||
                        (prod.category || '').toLowerCase().includes(q) ||
                        (prod.description || '').toLowerCase().includes(q)
                      );

                      if (matches.length === 0) {
                        return (
                          <div className="text-center py-6 flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-3xl mb-1">search_off</span>
                            <p className="text-xs font-semibold">
                              {language === 'en'
                                ? `No products found matching "${searchKeyword}"`
                                : `"${searchKeyword}" এর সাথে মিল থাকা কোনো পণ্য পাওয়া যায়নি`}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                          {matches.slice(0, 5).map((prod) => (
                            <div
                              key={prod._id}
                              onClick={() => {
                                if (setDetailsProduct) {
                                  setDetailsProduct(prod);
                                  setCurrentTab('product-details');
                                }
                                setIsSearchFocused(false);
                                setIsSearchExpanded(false);
                              }}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all group"
                            >
                              <img
                                src={prod.image || 'https://raw.githubusercontent.com/shadcn.png'}
                                alt={prod.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-lg bg-slate-100 group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate group-hover:text-[#0088FF] transition-colors">
                                  {prod.name}
                                </h5>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">{prod.category}</p>
                              </div>
                              <div className="text-right">
                                {prod.originalPrice && prod.originalPrice > prod.price ? (
                                  <>
                                    <span className="text-[10px] text-slate-400 line-through mr-1">
                                      ৳{prod.originalPrice}
                                    </span>
                                    <span className="text-[11px] font-bold text-red-500">৳{prod.price}</span>
                                  </>
                                ) : (
                                  <span className="text-[11px] font-bold text-slate-800">৳{prod.price}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Access */}
          <div className="relative" ref={userDropdownRef}>
            {user ? (
              <>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="relative p-2 hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center border border-outline-variant/40 hover:border-[#FF4B7E]/40 hover:shadow-sm group"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#FF4B7E] group-hover:scale-110 transition-transform">
                    person
                  </span>
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-outline-variant/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4B7E] to-[#0088FF]" />
                    <div className="px-4 py-3 mb-1 flex items-center gap-3 border-b border-outline-variant/30">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4B7E] to-[#FF6B6B] flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
                          {t('nav.signedInAs')}
                        </p>
                        <p className="text-[13px] font-bold text-deep-navy truncate">
                          {user.name}
                        </p>
                      </div>
                    </div>
                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-[#FF4B7E]/8 hover:to-transparent text-[12px] font-medium text-on-surface hover:text-[#FF4B7E] transition-all flex items-center gap-2.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                        {language === 'en' ? 'Admin Panel' : 'অ্যাডমিন প্যানেল'}
                      </button>
                    )}
                    <button
                      onClick={handleViewOrders}
                      className="w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-[#0088FF]/8 hover:to-transparent text-[12px] font-medium text-on-surface hover:text-[#0088FF] transition-all flex items-center gap-2.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">history</span>
                      {t('nav.orders')}
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                        resetAllFilters();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-sale-red/8 text-[12px] font-medium text-sale-red transition-all flex items-center gap-2.5 border-t border-outline-variant/30 mt-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="p-2 hover:bg-surface-container-low rounded-full transition-all flex items-center justify-center border border-outline-variant/40 hover:border-[#FF4B7E]/40 hover:shadow-sm group"
              >
                <span className="material-symbols-outlined text-[20px] text-[#FF4B7E] group-hover:scale-110 transition-transform">
                  person
                </span>
              </button>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 hover:bg-surface-container-low rounded-full transition-all relative flex items-center justify-center group"
            aria-label="Cart"
          >
            <span className="material-symbols-outlined text-[20px] text-[#FF4B7E] group-hover:scale-110 transition-transform">
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-[#0088FF] to-[#00C2FF] text-white text-[9px] font-bold h-[18px] min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-md shadow-[#0088FF]/40 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="px-3 py-1.5 text-[11px] font-bold border border-outline-variant/60 rounded-full bg-white/60 backdrop-blur hover:bg-gradient-to-r hover:from-[#0088FF]/10 hover:to-[#00C2FF]/10 hover:border-[#0088FF]/40 transition-all duration-300 flex items-center gap-1.5 text-deep-navy shadow-sm active:scale-95"
            title={language === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}
          >
            <span className="material-symbols-outlined text-[14px] text-[#0088FF]">
              language
            </span>
            <span className="tracking-wide">{language === 'en' ? 'EN' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </header>
      {/* Mobile User Dropdown Menu */}
      {isUserDropdownOpen && user && (
        <div ref={mobileUserDropdownRef} className="md:hidden fixed bottom-[72px] right-4 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden font-body-md text-on-surface">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4B7E] to-[#0088FF]" />
          <div className="px-4 py-3 mb-1 flex items-center gap-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4B7E] to-[#FF6B6B] flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                {t('nav.signedInAs')}
              </p>
              <p className="text-[12px] font-bold text-slate-800 truncate">
                {user.name}
              </p>
            </div>
          </div>
          {user.isAdmin && (
            <button
              onClick={() => {
                setCurrentTab('admin');
                setIsUserDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[12px] font-medium text-slate-700 hover:text-[#FF4B7E] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              {language === 'en' ? 'Admin Panel' : 'অ্যাডমিন প্যানেল'}
            </button>
          )}
          <button
            onClick={() => {
              handleViewOrders();
              setIsUserDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[12px] font-medium text-slate-700 hover:text-[#0088FF] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            {t('nav.orders')}
          </button>
          <button
            onClick={() => {
              logout();
              setIsUserDropdownOpen(false);
              resetAllFilters();
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 text-[12px] font-medium text-red-500 flex items-center gap-2 border-t border-slate-100 mt-1"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            {t('nav.logout')}
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe-bottom font-body-md text-on-surface">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Home Tab */}
          <button
            onClick={resetAllFilters}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentTab === 'home' && sortFilter === 'none' && selectedCategory === 'All' && !detailsProduct
                ? 'text-[#0088FF]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">home</span>
            <span className="text-[10px] font-medium mt-0.5">{t('nav.home')}</span>
          </button>

          {/* Shop Tab */}
          <button
            onClick={() => {
              setCurrentTab('shop');
              setSelectedCategory('All');
              setSortFilter('none');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentTab === 'shop' || currentTab === 'neck-mounts' || currentTab === 'top-selling' || currentTab === 'new-arrival' || currentTab === 'offers-deals'
                ? 'text-[#0088FF]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">grid_view</span>
            <span className="text-[10px] font-medium mt-0.5">{t('nav.shop')}</span>
          </button>

          {/* Wishlist Tab */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full text-slate-500 hover:text-slate-800 relative"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            <span className="text-[10px] font-medium mt-0.5">{t('nav.wishlist')}</span>
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-4 bg-gradient-to-br from-[#FF4B7E] to-[#FF6B6B] text-white text-[9px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Tab */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (user) {
                setIsUserDropdownOpen(!isUserDropdownOpen);
              } else {
                setCurrentTab('auth');
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentTab === 'auth' || isUserDropdownOpen || currentTab === 'admin' || currentTab === 'orders'
                ? 'text-[#0088FF]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
            <span className="text-[10px] font-medium mt-0.5">
              {user ? (user.name?.split(' ')[0] || 'Account') : 'Account'}
            </span>
          </button>
        </div>
      </div>
  </div>
  );
}