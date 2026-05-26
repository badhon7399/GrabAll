import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SuccessViewProps {
  placedOrder: Order | null;
  shippingName: string;
  resetAllFilters: () => void;
}

export default function SuccessView({
  placedOrder,
  shippingName,
  resetAllFilters,
}: SuccessViewProps) {
  const { language, t } = useLanguage();

  if (!placedOrder) return null;

  return (
    <section className="py-12 max-w-xl mx-auto text-center bg-white p-8 md:p-12 rounded-2xl shadow-md border border-outline-variant/30 animate-in zoom-in-95 duration-300">
      <span className="material-symbols-outlined text-7xl text-gold-accent animate-bounce">
        check_circle
      </span>
      
      <h2 className="text-3xl font-bold text-deep-navy mt-4">
        {t('success.thankyou')}
      </h2>
      <p className="text-on-surface-variant mt-2 text-xs">
        {language === 'en' 
          ? 'Your order has been placed successfully under Cash On Delivery.' 
          : 'ক্যাশ অন ডেলিভারির মাধ্যমে আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে ও প্রক্রিয়া করা হচ্ছে।'}
      </p>
      
      <div className="my-8 p-6 bg-surface-container-low rounded-xl text-left border text-xs space-y-3">
        <div className="flex justify-between font-semibold border-b pb-2 mb-2">
          <span>{t('success.orderId')}</span>
          <span className="font-mono text-[10px] text-[#0088FF]">{placedOrder._id}</span>
        </div>
        <div className="flex justify-between">
          <span>{language === 'en' ? 'Shipping Name' : 'শিপিং নাম'}</span>
          <span>{placedOrder.guestDetails?.name || shippingName}</span>
        </div>
        <div className="flex justify-between">
          <span>{language === 'en' ? 'Delivery Address' : 'ডেলিভারি ঠিকানা'}</span>
          <span className="text-right max-w-xs">{placedOrder.shippingAddress}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-2 text-[#0088FF]">
          <span>{language === 'en' ? 'Paid via COD' : 'ক্যাশ অন ডেলিভারি পরিশোধযোগ্য'}</span>
          <span>৳ {placedOrder.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={resetAllFilters}
        className="px-8 py-3 bg-[#0088FF] text-white rounded-xl hover:bg-[#0088FF]/90 transition-all font-semibold text-xs"
      >
        {t('success.backHome')}
      </button>
    </section>
  );
}
