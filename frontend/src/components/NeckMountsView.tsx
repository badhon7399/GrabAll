import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NeckMountsViewProps {
  products: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onBuyNow: (product: Product, qty: number) => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: string[];
}

export default function NeckMountsView({
  products,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onToggleWishlist,
  wishlist,
}: NeckMountsViewProps) {
  const { language, t } = useLanguage();
  const neckMountProducts = products.filter(p => p.category === 'Neck Mounts');

  const getCategoryName = (cat: string) => {
    if (cat === 'All') return t('All');
    if (cat === 'Content Gear') return t('cat.contentGear');
    if (cat === 'Microphones') return t('cat.microphones');
    if (cat === 'Power Banks') return t('cat.powerBanks');
    if (cat === 'Neck Mounts') return t('cat.neckMounts');
    if (cat === 'Smart Finder') return t('cat.smartFinder');
    return cat;
  };

  return (
    <div className="space-y-16">
      {/* Immersive Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-deep-navy to-[#0F1E36] text-white p-8 md:p-12 lg:p-16 border border-outline-variant/10 shadow-lg">
        {/* Decorative Light Glows */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#0088FF]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-[#FF4B7E]/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>

        <div className="max-w-2xl space-y-6">
          <span className="text-[11px] font-bold bg-[#0088FF]/20 text-[#0088FF] px-4 py-1.5 rounded-full uppercase tracking-wider">
            {t('nav.neckMounts')}
          </span>
          <h1 className="text-3xl md:text-5xl font-display-lg font-bold leading-tight">
            {t('neck.title')}
          </h1>
          <p className="text-sm text-on-surface-variant/80 leading-relaxed">
            {t('neck.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
              <span className="material-symbols-outlined text-[#0088FF] text-lg">sync</span>
              <span>{t('neck.feat3')}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
              <span className="material-symbols-outlined text-[#FF4B7E] text-lg">health_and_safety</span>
              <span>{t('neck.feat1')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Use a Neck Mount - Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0088FF]/10 flex items-center justify-center text-[#0088FF]">
            <span className="material-symbols-outlined">videocam</span>
          </div>
          <h3 className="font-bold text-deep-navy text-sm">{t('neck.feat3')}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t('neck.feat3Desc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4B7E]/10 flex items-center justify-center text-[#FF4B7E]">
            <span className="material-symbols-outlined">construction</span>
          </div>
          <h3 className="font-bold text-deep-navy text-sm">{t('neck.feat1')}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t('neck.feat1Desc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gold-accent/10 flex items-center justify-center text-gold-accent">
            <span className="material-symbols-outlined">cell_tower</span>
          </div>
          <h3 className="font-bold text-deep-navy text-sm">{t('neck.feat2')}</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t('neck.feat2Desc')}
          </p>
        </div>
      </div>

      {/* Neck Mount Products List */}
      <div className="space-y-6">
        <div className="flex justify-between items-baseline">
          <h2 className="text-xl font-bold text-deep-navy">{t('neck.showcaseTitle')}</h2>
          <span className="text-xs font-semibold text-on-surface-variant">
            {language === 'en' 
              ? `${neckMountProducts.length} premium models` 
              : `${neckMountProducts.length} টি প্রিমিয়াম মডেল`}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {neckMountProducts.map((prod) => {
            const isWishlisted = wishlist.includes(prod._id);
            const discount = prod.discountPercent || Math.round(((prod.originalPrice - prod.salePrice) / prod.originalPrice) * 100);

            return (
              <div
                key={prod._id}
                className="bg-white rounded-3xl p-4 border border-outline-variant/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-xs relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(prod);
                  }}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full border transition-all ${
                    isWishlisted 
                      ? 'border-[#FF4B7E]/30 bg-[#FF4B7E]/5 text-[#FF4B7E]' 
                      : 'border-outline-variant/30 bg-white/80 hover:bg-white text-on-surface-variant'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${isWishlisted ? 'fill-1' : ''}`}>
                    favorite
                  </span>
                </button>

                {/* Product Image */}
                <div 
                  onClick={() => onSelectProduct(prod)}
                  className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-4"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-sale-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Product Meta */}
                <div onClick={() => onSelectProduct(prod)} className="space-y-1 mb-4">
                  <span className="text-[9px] font-bold text-on-surface-variant/80 tracking-wide uppercase">
                    {getCategoryName(prod.category)}
                  </span>
                  <h3 className="font-semibold text-deep-navy leading-snug line-clamp-2 group-hover:text-[#0088FF] transition-colors">
                    {prod.name}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1.5">
                    <span className="font-bold text-[#0088FF] text-sm">৳ {prod.salePrice.toLocaleString()}</span>
                    {prod.originalPrice > prod.salePrice && (
                      <span className="text-[10px] text-outline line-through">৳ {prod.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Quick Add to Cart */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(prod, 1);
                    }}
                    className="flex-1 py-2 bg-surface-container-low border border-outline-variant text-deep-navy rounded-xl hover:bg-[#0088FF]/5 hover:border-[#0088FF] transition-all font-semibold flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    {t('prod.addToCart')}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow(prod, 1);
                    }}
                    className="flex-1 py-2 bg-[#0088FF] text-white rounded-xl hover:bg-[#0088FF]/90 transition-all font-semibold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">flash_on</span>
                    {t('prod.buyNow')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
