import type { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface OrdersViewProps {
  userOrders: Order[];
  loadingOrders: boolean;
  resetAllFilters: () => void;
}

export default function OrdersView({
  userOrders,
  loadingOrders,
  resetAllFilters,
}: OrdersViewProps) {
  const { language, t } = useLanguage();

  const getOrderStatus = (status: string) => {
    if (language === 'en') return status;
    const statuses: Record<string, string> = {
      'Pending': 'অপেক্ষমান',
      'Processing': 'প্রক্রিয়াধীন',
      'Shipped': 'শিপড',
      'Delivered': 'ডেলিভার্ড',
      'Cancelled': 'বাতিলকৃত'
    };
    return statuses[status] || status;
  };

  const getPaymentStatus = (status: string) => {
    if (language === 'en') return status;
    const statuses: Record<string, string> = {
      'Unpaid': 'পরিশোধিত নয়',
      'Paid': 'পরিশোধিত',
      'Refunded': 'রিফান্ডকৃত'
    };
    return statuses[status] || status;
  };

  return (
    <section className="py-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-deep-navy">{t('orders.title')}</h2>
        <button 
          onClick={resetAllFilters}
          className="px-4 py-2 border rounded-xl hover:bg-surface-container-low font-semibold transition-all text-xs"
        >
          {language === 'en' ? 'Back to Home' : 'হোমে ফিরে যান'}
        </button>
      </div>

      {loadingOrders ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#0088FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-on-surface-variant font-semibold text-xs">
            {language === 'en' ? 'Loading orders...' : 'অর্ডার লোড হচ্ছে...'}
          </p>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-outline-variant/30 text-xs">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_bag</span>
          <p className="text-lg font-semibold text-on-surface-variant">{t('orders.noOrders')}</p>
          <button 
            onClick={resetAllFilters}
            className="mt-4 px-6 py-2 bg-deep-navy text-white rounded-xl hover:bg-[#0088FF] transition-all font-semibold"
          >
            {language === 'en' ? 'Shop Now' : 'এখনই কিনুন'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order._id} className="bg-white border rounded-2xl shadow-sm overflow-hidden text-xs">
              {/* Order Metadata Row */}
              <div className="bg-surface-container-low p-4 flex flex-col md:flex-row justify-between gap-4 border-b text-sm font-semibold text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="block text-xs text-on-surface-variant font-medium">{t('orders.date')}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD')}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-on-surface-variant font-medium">{t('orders.total')}</span>
                    <span>৳ {order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-on-surface-variant font-medium">{t('orders.status')}</span>
                    <span className="text-[#0088FF]">{getOrderStatus(order.orderStatus)}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-on-surface-variant font-medium">{language === 'en' ? 'Payment' : 'পেমেন্ট'}</span>
                    <span>{getPaymentStatus(order.paymentStatus)}</span>
                  </div>
                </div>
                <div className="md:text-right">
                  <span className="block text-xs text-on-surface-variant">{t('orders.id')}</span>
                  <span className="font-mono text-xs text-on-surface-variant">{order._id}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 divide-y divide-outline-variant/30">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="py-3 flex gap-4 items-center">
                    <img 
                      src={item.image} 
                      className="w-16 h-16 object-cover rounded-xl border" 
                      alt={item.name} 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-on-surface text-sm">{item.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {language === 'en' 
                          ? `Quantity: ${item.qty} × ৳ ${item.price.toLocaleString()}` 
                          : `পরিমাণ: ${item.qty} × ৳ ${item.price.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
