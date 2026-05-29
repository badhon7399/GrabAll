import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageUrl } from '../utils/image';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelect?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isInWishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelect,
}: ProductCardProps) {
  const { language, t } = useLanguage();

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'Content Gear': return t('cat.contentGear');
      case 'Microphones': return t('cat.microphones');
      case 'Power Banks': return t('cat.powerBanks');
      case 'Neck Mounts': return t('cat.neckMounts');
      case 'Smart Finder': return t('cat.smartFinder');
      default: return cat;
    }
  };

  return (
    <div 
      onClick={() => onSelect?.(product)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-surface-container group flex flex-col h-full relative cursor-pointer"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10 bg-sale-red text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
        -{product.discountPercent}% {t('prod.discount')}
      </div>

      {/* Wishlist Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white text-on-surface rounded-full shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none"
      >
        <span className={`material-symbols-outlined text-lg ${isInWishlist ? 'text-sale-red fill-1 font-semibold' : 'text-on-surface-variant'}`}>
          favorite
        </span>
      </button>

      {/* Image with hover overlays */}
      <div className="aspect-square bg-surface-container overflow-hidden relative">
        <img
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={getOptimizedImageUrl(product.image, 400)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-deep-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white p-2.5 rounded-full text-deep-navy hover:bg-[#0088FF] hover:text-white transition-colors shadow-md flex items-center justify-center"
            title={language === 'en' ? 'Quick View' : 'কুইক ভিউ'}
          >
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow text-xs">
        <span className="text-[10px] font-bold text-gold-accent uppercase tracking-wider mb-1">
          {getCategoryName(product.category)}
        </span>
        <h3 className="text-xs md:text-sm font-semibold text-deep-navy mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-auto pt-2 flex items-center gap-2">
          <span className="text-sm md:text-base text-deep-navy font-bold">
            ৳ {product.salePrice.toLocaleString()}
          </span>
          <span className="text-xs text-outline line-through">
            ৳ {product.originalPrice.toLocaleString()}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="mt-4 w-full py-2 bg-deep-navy text-white text-xs font-semibold rounded-lg hover:bg-[#0088FF] transition-colors flex justify-center items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">shopping_cart</span> {t('prod.addToCart')}
        </button>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-surface-container flex flex-col h-full animate-pulse">
      <div className="aspect-square bg-slate-100 relative" />
      <div className="p-4 flex flex-col flex-grow text-xs gap-3">
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-slate-200 rounded" />
          <div className="h-3.5 w-5/6 bg-slate-200 rounded" />
        </div>
        <div className="mt-auto pt-2 flex items-center gap-2">
          <div className="h-5 w-1/3 bg-slate-200 rounded" />
          <div className="h-3.5 w-1/4 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-full bg-slate-200 rounded-lg mt-4" />
      </div>
    </div>
  );
}
