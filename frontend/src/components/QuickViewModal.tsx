import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const { t } = useLanguage();

  if (!product) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative z-10 shadow-2xl border border-outline-variant/30 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary focus:outline-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 aspect-square bg-surface-container rounded-xl overflow-hidden shadow-inner">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col text-xs">
          <span className="text-xs font-semibold text-gold-accent uppercase tracking-wider">
            {getCategoryName(product.category)}
          </span>
          <h3 className="text-xl font-bold text-deep-navy mt-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-on-surface-variant mt-4 flex-grow leading-relaxed">
            {product.description}
          </p>
          
          {/* Prices */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-bold text-deep-navy">
              ৳ {product.salePrice.toLocaleString()}
            </span>
            <span className="text-sm text-outline line-through">
              ৳ {product.originalPrice.toLocaleString()}
            </span>
            <span className="bg-sale-red text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              -{product.discountPercent}% {t('prod.discount')}
            </span>
          </div>
          
          {/* Action Trigger */}
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-1 py-3 bg-deep-navy text-white text-center rounded-xl hover:bg-[#0088FF] font-semibold transition-all flex justify-center items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">shopping_cart</span>
              {t('prod.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
