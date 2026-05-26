import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onToggleWishlist,
  onAddToCart,
}: WishlistDrawerProps) {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex animate-in slide-in-from-right duration-300">
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-[#0088FF] text-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">favorite</span>
              {t('wish.title')}
            </h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Saved Items Content */}
          <div className="flex-1 py-6 overflow-y-auto px-6 space-y-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 text-xs">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">heart_broken</span>
                <p className="text-on-surface-variant font-semibold text-lg">{t('wish.empty')}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-deep-navy text-white rounded-xl hover:bg-[#0088FF] transition-all font-semibold"
                >
                  {language === 'en' ? 'Browse Tech Gear' : 'টেক গিয়ার ব্রাউজ করুন'}
                </button>
              </div>
            ) : (
              wishlistItems.map((product) => (
                <div key={product._id} className="flex gap-4 border-b border-outline-variant/30 pb-4 text-xs">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded-xl border" 
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-deep-navy leading-snug line-clamp-2">
                        {product.name}
                      </h4>
                      <span className="text-on-surface-variant mt-1 block">
                        ৳ {product.salePrice.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="bg-deep-navy text-white px-3 py-1 rounded hover:bg-[#0088FF] font-semibold text-[10px] flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[12px]">shopping_cart</span>
                        {language === 'en' ? 'Add' : 'যোগ করুন'}
                      </button>
                      <button 
                        onClick={() => onToggleWishlist(product)}
                        className="text-[10px] font-semibold text-sale-red hover:underline flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[12px]">delete</span>
                        {language === 'en' ? 'Remove' : 'সরিয়ে ফেলুন'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
