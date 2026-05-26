import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../context/AuthContext';

interface CheckoutViewProps {
  shippingName: string;
  setShippingName: (s: string) => void;
  shippingEmail: string;
  setShippingEmail: (s: string) => void;
  shippingPhone: string;
  setShippingPhone: (s: string) => void;
  shippingAddress: string;
  setShippingAddress: (s: string) => void;
  handlePlaceOrder: (e: React.FormEvent, finalAmount?: number, promoCode?: string, paymentMethod?: string) => void;
  checkoutSubmitting: boolean;
  resetAllFilters: () => void;
}

/* ---------- Animation Variants ---------- */
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 140, damping: 18 },
  },
};

/* ---------- Reusable Floating Input ---------- */
interface FloatingFieldProps {
  icon: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}

const FloatingField: React.FC<FloatingFieldProps> = ({
  icon,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  textarea,
  required,
}) => {
  const baseClasses =
    'peer w-full bg-white/60 backdrop-blur-sm border border-slate-200/80 rounded-2xl ' +
    'pl-12 pr-4 pt-5 pb-2 text-sm text-slate-800 placeholder-transparent ' +
    'focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/10 focus:outline-none ' +
    'transition-all duration-300 shadow-sm hover:shadow-md';

  return (
    <motion.div variants={fadeUp} className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0088FF] transition-colors z-10">
        {icon}
      </div>

      {textarea ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseClasses} h-28 pt-6 resize-none`}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      <label
        className="absolute left-12 top-1.5 text-[10px] font-semibold uppercase tracking-wider
                   text-slate-500 group-focus-within:text-[#0088FF]
                   peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
                   peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case
                   peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-400
                   transition-all duration-200 pointer-events-none"
      >
        {label}
      </label>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */
export default function CheckoutView({
  shippingName,
  setShippingName,
  shippingEmail,
  setShippingEmail,
  shippingPhone,
  setShippingPhone,
  shippingAddress,
  setShippingAddress,
  handlePlaceOrder,
  checkoutSubmitting,
  resetAllFilters,
}: CheckoutViewProps) {
  const { cartItems, cartSubtotal } = useCart();
  const { language, t } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async () => {
    setPromoError('');
    if (!promoInput.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/promos/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput }),
      });
      if (res.ok) {
        const found = await res.json();
        setAppliedPromo(found);
        setPromoInput('');
      } else {
        const errData = await res.json();
        setPromoError(errData.message || (language === 'en' ? 'Invalid or inactive promo code.' : 'অকার্যকর প্রোমো কোড।'));
      }
    } catch {
      setPromoError(language === 'en' ? 'Error validating promo code.' : 'প্রোমো কোড যাচাই করতে সমস্যা হয়েছে।');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.round((cartSubtotal * appliedPromo.discount) / 100);
  }, [appliedPromo, cartSubtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.qty, 0),
    [cartItems]
  );

  const steps = [
    { id: 1, label: language === 'en' ? 'Cart' : 'কার্ট', done: true },
    { id: 2, label: language === 'en' ? 'Checkout' : 'চেকআউট', active: true },
    { id: 3, label: language === 'en' ? 'Confirmation' : 'নিশ্চিতকরণ', done: false },
  ];

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="relative py-10 overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#0088FF]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-20 w-[28rem] h-[28rem] bg-indigo-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 12 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0088FF] to-indigo-600 flex items-center justify-center shadow-lg shadow-[#0088FF]/30"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-[#0088FF] bg-clip-text text-transparent">
              {t('check.title')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'en'
                ? 'Almost there — review and place your order.'
                : 'প্রায় শেষ — অর্ডার চেক করে নিশ্চিত করুন।'}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-6">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * idx }}
                className="flex items-center gap-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${
                    s.active
                      ? 'bg-[#0088FF] text-white shadow-lg shadow-[#0088FF]/40 ring-4 ring-[#0088FF]/15'
                      : s.done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    s.active ? 'text-[#0088FF]' : s.done ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </motion.div>
              {idx < steps.length - 1 && (
                <div className="flex-1 max-w-[60px] h-[2px] bg-gradient-to-r from-slate-200 to-slate-100 rounded-full" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- Shipping Form ---------- */}
        <motion.div
          variants={scaleIn}
          className="lg:col-span-2 relative bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-3xl
                     shadow-[0_8px_40px_-12px_rgba(0,136,255,0.18)] border border-white/60
                     before:absolute before:inset-0 before:rounded-3xl before:p-[1px]
                     before:bg-gradient-to-br before:from-white/80 before:via-transparent before:to-[#0088FF]/10
                     before:-z-10"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#0088FF]" />
                {language === 'en' ? 'Shipping Details' : 'শিপিং তথ্য'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en'
                  ? 'We will deliver to the address below'
                  : 'নিচের ঠিকানায় ডেলিভারি দেওয়া হবে'}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold"
            >
              <Lock className="w-3.5 h-3.5" /> {language === 'en' ? 'Secure' : 'নিরাপদ'}
            </motion.div>
          </div>

          <motion.form
            onSubmit={(e) => handlePlaceOrder(e, finalTotal, appliedPromo?.code, paymentMethod === 'bkash' ? 'bKash / Nagad' : 'Cash On Delivery')}
            variants={container}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingField
                icon={<User className="w-4 h-4" />}
                label={t('check.name')}
                value={shippingName}
                onChange={setShippingName}
                placeholder="John Doe"
                required
              />
              <FloatingField
                icon={<Mail className="w-4 h-4" />}
                label={t('check.email')}
                type="email"
                value={shippingEmail}
                onChange={setShippingEmail}
                placeholder="john@example.com"
                required
              />
            </div>

            <FloatingField
              icon={<Phone className="w-4 h-4" />}
              label={t('check.phone')}
              type="tel"
              value={shippingPhone}
              onChange={setShippingPhone}
              placeholder="+88017XXXXXXXX"
              required
            />

            <FloatingField
              icon={<MapPin className="w-4 h-4" />}
              label={t('check.address')}
              value={shippingAddress}
              onChange={setShippingAddress}
              placeholder={
                language === 'en'
                  ? 'House, street, area, city...'
                  : 'বাসা, সড়ক, এলাকা, শহর...'
              }
              textarea
              required
            />

            {/* Payment Method */}
            <motion.div variants={fadeUp} className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {language === 'en' ? 'Payment Method' : 'পেমেন্ট পদ্ধতি'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPaymentMethod('cod')}
                  className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2
                             ${paymentMethod === 'cod'
                               ? 'bg-gradient-to-br from-[#0088FF]/5 via-white to-indigo-50/20 border-[#0088FF] shadow-md shadow-[#0088FF]/5'
                               : 'bg-white border-slate-200/80 hover:border-slate-300'
                             }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md
                                  ${paymentMethod === 'cod'
                                    ? 'bg-gradient-to-br from-[#0088FF] to-indigo-600 shadow-[#0088FF]/20 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                  }`}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-900 text-sm">
                      {language === 'en' ? 'Cash On Delivery' : 'ক্যাশ অন ডেলিভারি'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'en' ? 'Pay upon receipt' : 'হাতে পেয়ে মূল্য পরিশোধ'}
                    </span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <motion.div
                      layoutId="paymentCheck"
                      className="w-6 h-6 rounded-full bg-[#0088FF] flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* bKash / Nagad */}
                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPaymentMethod('bkash')}
                  className={`relative flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2
                             ${paymentMethod === 'bkash'
                               ? 'bg-gradient-to-br from-pink-50/30 via-white to-orange-50/20 border-pink-500 shadow-md shadow-pink-500/5'
                               : 'bg-white border-slate-200/80 hover:border-slate-300'
                             }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md
                                  ${paymentMethod === 'bkash'
                                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 shadow-pink-500/20 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                  }`}
                  >
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="block font-bold text-slate-900 text-sm">
                      {language === 'en' ? 'bKash / Nagad' : 'বিকাশ / নগদ'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {language === 'en' ? 'Pay securely online' : 'অনলাইনে পেমেন্ট করুন'}
                    </span>
                  </div>
                  {paymentMethod === 'bkash' && (
                    <motion.div
                      layoutId="paymentCheck"
                      className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              className="pt-6 flex flex-col-reverse sm:flex-row justify-between gap-3"
            >
              <motion.button
                type="button"
                onClick={resetAllFilters}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3.5 border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to Shopping' : 'শপিংয়ে ফিরে যান'}
              </motion.button>

              <motion.button
                type="submit"
                disabled={checkoutSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#0088FF] via-blue-600 to-indigo-600 shadow-lg shadow-[#0088FF]/40 hover:shadow-xl hover:shadow-[#0088FF]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <AnimatePresence mode="wait">
                  {checkoutSubmitting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {t('check.placing')}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cta"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {t('check.placeOrder')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* ---------- Order Summary ---------- */}
        <motion.aside
          variants={scaleIn}
          className="lg:sticky lg:top-6 h-fit"
        >
          <div className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl
                          shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-white/60
                          overflow-hidden">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0088FF] via-indigo-500 to-purple-500" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#0088FF]" />
                {t('check.summary')}
              </h3>
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0088FF]/10 text-[#0088FF]"
              >
                {itemCount} {language === 'en' ? 'items' : 'টি পণ্য'}
              </motion.span>
            </div>

            {/* Items list */}
            <div className="max-h-72 overflow-y-auto pr-2 -mr-2 mb-5 space-y-3
                            scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <AnimatePresence initial={false}>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 2 }}
                    className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0088FF] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        ৳ {item.product.salePrice.toLocaleString()} ×{' '}
                        {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      ৳ {(item.qty * item.product.salePrice).toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Promo Code Input */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {language === 'en' ? 'Have a Promo Code?' : 'প্রোমো কোড আছে?'}
              </label>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">local_offer</span>
                    <div>
                      <span className="text-xs font-bold text-emerald-800 tracking-wider font-mono">
                        {appliedPromo.code}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        {appliedPromo.type === 'percent'
                          ? (language === 'en' ? `${appliedPromo.discount}% Off` : `${appliedPromo.discount}% ছাড়`)
                          : (language === 'en' ? `৳${appliedPromo.discount} Off` : `৳${appliedPromo.discount} ছাড়`)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-emerald-800 hover:text-red-600 transition"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. CREATOR10' : 'যেমন: CREATOR10'}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0088FF] uppercase tracking-wider font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#0088FF] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition"
                  >
                    {language === 'en' ? 'Apply' : 'প্রয়োগ'}
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-[10px] text-red-500 mt-1 font-semibold pl-1">{promoError}</p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-slate-200 pt-4 mt-5 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t('check.subtotal')}</span>
                <span className="font-semibold">
                  ৳ {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-emerald-600">local_offer</span>
                    {language === 'en' ? 'Discount' : 'ছাড়'} ({appliedPromo.code})
                  </span>
                  <span className="font-semibold">
                    - ৳ {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> {t('check.shipping')}
                </span>
                <span className="font-semibold text-emerald-600">
                  {language === 'en' ? 'Free' : 'ফ্রি'}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-end pt-3 mt-3 border-t border-slate-200"
              >
                <div>
                  <span className="text-xs text-slate-500 block">
                    {t('check.total')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en'
                      ? 'incl. all taxes'
                      : 'সব ট্যাক্স সহ'}
                  </span>
                </div>
                <motion.span
                  key={finalTotal}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-extrabold bg-gradient-to-r from-[#0088FF] to-indigo-600 bg-clip-text text-transparent"
                >
                  ৳ {finalTotal.toLocaleString()}
                </motion.span>
              </motion.div>
            </div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center"
            >
              {[
                { icon: ShieldCheck, label: language === 'en' ? 'Secure' : 'নিরাপদ' },
                { icon: Truck, label: language === 'en' ? 'Fast' : 'দ্রুত' },
                { icon: CheckCircle2, label: language === 'en' ? 'Verified' : 'ভেরিফাইড' },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition"
                >
                  <b.icon className="w-4 h-4 text-[#0088FF]" />
                  <span className="text-[10px] font-semibold text-slate-500">
                    {b.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.aside>
      </div>
    </motion.section>
  );
}