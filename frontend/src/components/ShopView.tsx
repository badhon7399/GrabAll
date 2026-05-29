import { useState, useMemo } from 'react';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onBuyNow: (product: Product, qty: number) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: string[];
  initialCategory?: string;
}

export default function ShopView({
  products,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onToggleWishlist,
  wishlist,
  initialCategory = 'All',
}: ShopViewProps) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'best' | 'price-asc' | 'price-desc' | 'discount'>('best');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getCategoryName = (cat: string) => {
    if (cat === 'All') return t('All');
    if (cat === 'Content Gear') return t('cat.contentGear');
    if (cat === 'Microphones') return t('cat.microphones');
    if (cat === 'Power Banks') return t('cat.powerBanks');
    if (cat === 'Neck Mounts') return t('cat.neckMounts');
    if (cat === 'Smart Finder') return t('cat.smartFinder');
    return cat;
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPrice = p.salePrice <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.salePrice - b.salePrice;
        if (sortBy === 'price-desc') return b.salePrice - a.salePrice;
        if (sortBy === 'discount') {
          const discA =
            a.discountPercent ||
            Math.round(((a.originalPrice - a.salePrice) / a.originalPrice) * 100);
          const discB =
            b.discountPercent ||
            Math.round(((b.originalPrice - b.salePrice) / b.originalPrice) * 100);
          return discB - discA;
        }
        return 0; // 'best' (seed default order)
      });
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  return (
    <div className="space-y-10 relative">
      {/* Soft ambient background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#0088FF]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-[#FF4B7E]/10 rounded-full blur-3xl" />
      </div>

      {/* Category Header */}
      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#0088FF]/10 border border-[#0088FF]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0088FF]">
              {t('shop.title')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display-md font-extrabold text-deep-navy tracking-tight leading-tight">
            {t('shop.title')}
            <span className="ml-2 bg-gradient-to-r from-[#0088FF] to-[#00C2FF] bg-clip-text text-transparent">
              .
            </span>
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
            {t('shop.subtitle')}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur border border-outline-variant/40 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0088FF] to-[#00C2FF] flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
          </div>
          <div className="text-xs">
            <p className="font-bold text-deep-navy leading-tight">
              {language === 'en' ? `${products.length} Products` : `${products.length} টি পণ্য`}
            </p>
            <p className="text-[10px] text-on-surface-variant">
              {language === 'en' ? 'Curated collection' : 'নির্বাচিত সংগ্রহ'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Filter Sidebar */}
        <aside className="lg:col-span-3">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex gap-3 mb-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-1 py-3 px-4 bg-white/95 backdrop-blur-xl border border-outline-variant/40 rounded-2xl font-bold text-xs text-deep-navy flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0088FF]">tune</span>
              {showMobileFilters 
                ? (language === 'en' ? 'Hide Filters' : 'ফিল্টার বন্ধ করুন')
                : (language === 'en' ? 'Show Filters & Search' : 'ফিল্টার ও সার্চ দেখুন')}
            </button>
          </div>

          <div className={`${showMobileFilters ? 'block' : 'hidden lg:block'} lg:sticky lg:top-6 space-y-6`}>
            <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-outline-variant/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6 overflow-hidden">
              {/* Decorative gradient strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0088FF] via-[#00C2FF] to-[#FF4B7E]" />

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-deep-navy text-xs uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#0088FF]">
                    tune
                  </span>
                  {t('shop.sidebarTitle')}
                </h3>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceRange(3000);
                    setSortBy('best');
                  }}
                  className="text-[10px] font-semibold text-[#0088FF] hover:underline"
                >
                  {language === 'en' ? 'Reset' : 'রিসেট'}
                </button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {t('shop.searchLabel')}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('nav.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 border border-outline-variant/50 rounded-2xl text-xs bg-surface-container-low/40 placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-[#0088FF]/40 focus:border-[#0088FF] focus:bg-white transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] group-focus-within:text-[#0088FF] transition-colors">
                    search
                  </span>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-deep-navy"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {t('cat.title')}
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const count =
                      cat === 'All'
                        ? products.length
                        : products.filter((p) => p.category === cat).length;
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative w-full text-left px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all flex justify-between items-center group/cat ${active
                            ? 'bg-gradient-to-r from-[#0088FF]/10 to-[#00C2FF]/5 text-[#0088FF] border border-[#0088FF]/20 shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-low border border-transparent'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0088FF] animate-pulse" />
                          )}
                          {getCategoryName(cat)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${active
                              ? 'bg-[#0088FF] text-white'
                              : 'bg-outline-variant/20 text-on-surface-variant group-hover/cat:bg-outline-variant/40'
                            }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    {t('shop.priceRange')}
                  </label>
                  <span className="text-xs font-bold text-deep-navy bg-[#0088FF]/10 px-2.5 py-1 rounded-lg">
                    ৳ {priceRange.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#0088FF] h-1.5 bg-outline-variant/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-outline font-semibold">
                  <span>৳ 300</span>
                  <span>৳ 3,000</span>
                </div>
              </div>
            </div>

            {/* Promotional card */}
            <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-deep-navy via-[#0a1a3a] to-[#0088FF] text-white shadow-lg">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#FF4B7E]/30 blur-2xl" />
              <div className="relative">
                <span className="material-symbols-outlined text-[24px] mb-2 block">
                  local_offer
                </span>
                <h4 className="font-bold text-sm mb-1">
                  {language === 'en' ? 'Free Delivery' : 'ফ্রি ডেলিভারি'}
                </h4>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  {language === 'en' 
                    ? 'On all orders above ৳ 1,500 across Bangladesh.' 
                    : 'সারা বাংলাদেশে ১,৫০০ টাকার বেশি অর্ডারে প্রযোজ্য।'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Product Grid & Sorting */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-outline-variant/40 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0088FF]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#0088FF]">
                  inventory_2
                </span>
              </div>
              <span className="font-semibold text-on-surface-variant">
                {language === 'en' ? (
                  <>
                    Showing{' '}
                    <span className="font-bold text-deep-navy">{filteredProducts.length}</span> of{' '}
                    <span className="font-bold text-deep-navy">{products.length}</span> Products
                  </>
                ) : (
                  <>
                    <span className="font-bold text-deep-navy">{products.length}</span> টির মধ্যে{' '}
                    <span className="font-bold text-deep-navy">{filteredProducts.length}</span> টি
                    পণ্য দেখাচ্ছে
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-on-surface-variant font-semibold">{t('shop.sortBy')}:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-9 py-2 border border-outline-variant/60 rounded-xl bg-white font-semibold text-deep-navy focus:outline-none focus:ring-2 focus:ring-[#0088FF]/40 focus:border-[#0088FF] transition-all cursor-pointer"
                >
                  <option value="best">{t('shop.sort.none')}</option>
                  <option value="price-asc">{t('shop.sort.priceLow')}</option>
                  <option value="price-desc">{t('shop.sort.priceHigh')}</option>
                  <option value="discount">{t('shop.sort.discount')}</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Catalog Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white/80 backdrop-blur-xl border border-dashed border-outline-variant/50 rounded-3xl space-y-5">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0088FF]/10 to-[#FF4B7E]/10">
                <span className="material-symbols-outlined text-[#0088FF] text-5xl">
                  shopping_bag
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-deep-navy">{t('prod.noProducts')}</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {language === 'en' 
                    ? 'Try adjusting your filters or search keywords.' 
                    : 'আপনার ফিল্টার বা খোঁজার শব্দ পরিবর্তন করে চেষ্টা করুন।'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setPriceRange(3000);
                  setSortBy('best');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0088FF] to-[#00C2FF] text-white rounded-2xl text-xs font-bold hover:shadow-lg hover:shadow-[#0088FF]/30 hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                {t('prod.resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {filteredProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod._id);
                const discount =
                  prod.discountPercent ||
                  Math.round(((prod.originalPrice - prod.salePrice) / prod.originalPrice) * 100);
                return (
                  <div
                    key={prod._id}
                    className="relative bg-white rounded-3xl p-4 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,136,255,0.12)] hover:-translate-y-1.5 hover:border-[#0088FF]/30 transition-all duration-500 flex flex-col cursor-pointer group text-xs overflow-hidden"
                  >
                    {/* Decorative gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0088FF]/0 via-transparent to-[#FF4B7E]/0 group-hover:from-[#0088FF]/5 group-hover:to-[#FF4B7E]/5 transition-all duration-500 pointer-events-none" />

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(prod);
                      }}
                      className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110 active:scale-95 ${isWishlisted
                          ? 'border-[#FF4B7E]/40 bg-[#FF4B7E]/10 text-[#FF4B7E] shadow-md shadow-[#FF4B7E]/20'
                          : 'border-outline-variant/40 bg-white/70 hover:bg-white text-on-surface-variant hover:text-[#FF4B7E]'
                        }`}
                      aria-label="Toggle wishlist"
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] transition-transform ${isWishlisted ? 'fill-1 scale-110' : ''
                          }`}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Image */}
                    <div
                      onClick={() => onSelectProduct(prod)}
                      className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-surface-container-low to-white mb-4"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-[#FF4B7E] to-[#FF6B6B] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-[#FF4B7E]/30 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px]">bolt</span>-
                          {discount}%
                        </span>
                      )}

                      {/* Quick view hint */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[10px] font-bold text-deep-navy opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">visibility</span>
                        {language === 'en' ? 'Quick view' : 'কুইক ভিউ'}
                      </div>
                    </div>

                    {/* Description and metadata */}
                    <div
                      onClick={() => onSelectProduct(prod)}
                      className="space-y-1.5 mb-4 flex-1"
                    >
                      <span className="inline-block text-[9px] font-extrabold text-[#0088FF] tracking-[0.12em] uppercase bg-[#0088FF]/8 px-2 py-0.5 rounded-md">
                        {getCategoryName(prod.category)}
                      </span>
                      <h3 className="font-bold text-deep-navy leading-snug line-clamp-2 group-hover:text-[#0088FF] transition-colors text-[13px]">
                        {prod.name}
                      </h3>
                      <div className="flex items-baseline gap-2 pt-1.5">
                        <span className="font-extrabold bg-gradient-to-r from-[#0088FF] to-[#00C2FF] bg-clip-text text-transparent text-base">
                          ৳ {prod.salePrice.toLocaleString()}
                        </span>
                        {prod.originalPrice > prod.salePrice && (
                          <span className="text-[10px] text-outline line-through">
                            ৳ {prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="flex gap-2 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(prod, 1);
                        }}
                        className="flex-1 py-2.5 bg-surface-container-low border border-outline-variant/60 text-deep-navy rounded-xl hover:bg-[#0088FF]/5 hover:border-[#0088FF] hover:text-[#0088FF] active:scale-95 transition-all font-bold flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          shopping_cart
                        </span>
                        <span className="hidden sm:inline">{t('prod.addToCart')}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyNow(prod, 1);
                        }}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#0088FF] to-[#00C2FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#0088FF]/30 hover:-translate-y-0.5 active:scale-95 transition-all font-bold flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">flash_on</span>
                        <span className="hidden sm:inline">{t('prod.buyNow')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}