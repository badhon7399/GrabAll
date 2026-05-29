import { useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageUrl } from '../utils/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab: (t: 'home' | 'checkout' | 'orders' | 'success') => void;
}

// ——————————————————————————————————————————————
// Motion presets (Apple-style spring + easing)
// ——————————————————————————————————————————————
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: 'spring', stiffness: 320, damping: 36, mass: 0.9 } as const;

const backdropVariants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(14px)',
    transition: { duration: 0.35, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

const panelVariants = {
  hidden: { x: '100%', opacity: 0.6 },
  visible: { x: 0, opacity: 1, transition: SPRING },
  exit: {
    x: '100%',
    opacity: 0.4,
    transition: { duration: 0.32, ease: EASE_OUT },
  },
};

const listVariants = {
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

const footerVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.18, duration: 0.5, ease: EASE_OUT } },
};

export default function CartDrawer({
  isOpen,
  onClose,
  setCurrentTab,
}: CartDrawerProps) {
  const { cartItems, cartSubtotal, updateQty, removeFromCart } = useCart();
  const { language, t } = useLanguage();

  // Lock body scroll + ESC to close (UX polish, no logic change)
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* ——— Backdrop ——— */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/40"
            style={{ WebkitBackdropFilter: 'blur(14px)' }}
          />

          {/* ——— Drawer Panel ——— */}
          <motion.aside
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-y-0 right-0 w-screen max-w-md flex flex-col
                       bg-white/85 backdrop-blur-2xl
                       border-l border-white/40
                       shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]
                       overflow-hidden"
          >
            {/* Subtle ambient gradient wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70
                         bg-[radial-gradient(120%_60%_at_100%_0%,rgba(0,136,255,0.10),transparent_60%),radial-gradient(80%_50%_at_0%_100%,rgba(255,75,126,0.07),transparent_60%)]"
            />

            {/* ——— Header ——— */}
            <motion.header
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.5, ease: EASE_OUT }}
              className="relative px-7 pt-7 pb-5 flex items-center justify-between
                         border-b border-black/[0.06]"
            >
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ rotate: -8, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ ...SPRING, delay: 0.12 }}
                  className="material-symbols-outlined text-[22px] text-[#FF4B7E]"
                >
                  shopping_bag
                </motion.span>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-neutral-900">
                  {t('cart.title')}
                </h3>
                {cartItems.length > 0 && (
                  <motion.span
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full
                               bg-neutral-900 text-white"
                  >
                    {cartItems.reduce((n, i) => n + i.qty, 0)}
                  </motion.span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-full
                           bg-neutral-100 hover:bg-neutral-200/80
                           text-neutral-700"
                aria-label="Close cart"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </motion.button>
            </motion.header>

            {/* ——— Items ——— */}
            <div className="relative flex-1 overflow-y-auto px-7 py-6">
              <AnimatePresence mode="wait" initial={false}>
                {cartItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: EASE_OUT }}
                    className="h-full flex flex-col items-center justify-center text-center px-6"
                  >
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ ...SPRING, delay: 0.1 }}
                      className="w-20 h-20 rounded-full grid place-items-center
                                 bg-gradient-to-br from-neutral-100 to-neutral-200
                                 shadow-inner mb-6"
                    >
                      <span className="material-symbols-outlined text-4xl text-neutral-400">
                        shopping_bag
                      </span>
                    </motion.div>
                    <p className="text-[17px] font-semibold text-neutral-900 tracking-[-0.01em]">
                      {t('cart.empty')}
                    </p>
                    <p className="text-[13px] text-neutral-500 mt-1.5 max-w-[16rem]">
                      {language === 'en'
                        ? 'Your bag is feeling light. Discover something special.'
                        : 'আপনার ব্যাগ খালি। নতুন কিছু আবিষ্কার করুন।'}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                      onClick={onClose}
                      className="mt-7 px-6 py-3 rounded-full bg-neutral-900 text-white text-[13px] font-semibold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:bg-neutral-800 transition-colors"
                    >
                      {language === 'en' ? 'Shop Tech Deals' : 'টেক ডিলস দেখুন'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <LayoutGroup>
                    <motion.ul
                      key="list"
                      variants={listVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-4"
                    >
                      <AnimatePresence initial={false}>
                        {cartItems.map((item) => (
                          <motion.li
                            key={item._id}
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="group relative flex gap-4 p-4 rounded-2xl
                                       bg-white/70 backdrop-blur-md
                                       border border-black/[0.04]
                                       shadow-[0_4px_20px_-12px_rgba(0,0,0,0.15)]
                                       hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.22)]
                                       transition-shadow"
                          >
                            <motion.div
                              layout
                              className="relative w-20 h-20 rounded-xl overflow-hidden
                                         bg-neutral-100 flex-shrink-0
                                         ring-1 ring-black/[0.04]"
                            >
                              <motion.img
                                src={getOptimizedImageUrl(item.product.image, 160)}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.6, ease: EASE_OUT }}
                              />
                            </motion.div>

                            <div className="flex-1 min-w-0 flex flex-col">
                              <h4 className="text-[13.5px] font-semibold text-neutral-900
                                             leading-snug line-clamp-2 tracking-[-0.005em]">
                                {item.product.name}
                              </h4>
                              <span className="text-[11.5px] text-neutral-500 mt-0.5">
                                {language === 'en'
                                  ? `৳ ${item.product.salePrice.toLocaleString()} each`
                                  : `প্রতিটি ৳ ${item.product.salePrice.toLocaleString()}`}
                              </span>

                              <div className="flex justify-between items-center mt-auto pt-2">
                                {/* Quantity */}
                                <div className="flex items-center bg-neutral-100/80 rounded-full p-0.5">
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQty(item._id, item.qty - 1)}
                                    className="w-7 h-7 grid place-items-center rounded-full
                                               text-neutral-700 hover:bg-white hover:shadow-sm
                                               transition-all"
                                    aria-label="Decrease quantity"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      remove
                                    </span>
                                  </motion.button>
                                  <motion.span
                                    key={item.qty}
                                    initial={{ y: -6, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-2.5 text-[12.5px] font-semibold text-neutral-900 tabular-nums min-w-[1.5rem] text-center"
                                  >
                                    {item.qty}
                                  </motion.span>
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQty(item._id, item.qty + 1)}
                                    className="w-7 h-7 grid place-items-center rounded-full
                                               text-neutral-700 hover:bg-white hover:shadow-sm
                                               transition-all"
                                    aria-label="Increase quantity"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      add
                                    </span>
                                  </motion.button>
                                </div>

                                {/* Remove */}
                                <motion.button
                                  whileHover={{ x: 1 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-[11.5px] font-medium text-neutral-400
                                             hover:text-[#FF4B7E] flex items-center gap-1
                                             transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    delete
                                  </span>
                                  {language === 'en' ? 'Remove' : 'সরিয়ে ফেলুন'}
                                </motion.button>
                              </div>
                            </div>

                            <motion.span
                              layout
                              key={item.qty * item.product.salePrice}
                              initial={{ scale: 0.9, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.25, ease: EASE_OUT }}
                              className="self-start text-[13.5px] font-semibold text-neutral-900 tracking-[-0.01em] tabular-nums"
                            >
                              ৳ {(item.qty * item.product.salePrice).toLocaleString()}
                            </motion.span>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </motion.ul>
                  </LayoutGroup>
                )}
              </AnimatePresence>
            </div>

            {/* ——— Footer / Subtotal & Checkout ——— */}
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.footer
                  variants={footerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ y: 30, opacity: 0, transition: { duration: 0.25 } }}
                  className="relative px-7 pt-5 pb-7 border-t border-black/[0.06]
                             bg-white/70 backdrop-blur-xl"
                >
                  <div className="flex items-baseline justify-between mb-5">
                    <span className="text-[13px] font-medium text-neutral-500 uppercase tracking-[0.08em]">
                      {t('cart.subtotal')}
                    </span>
                    <motion.span
                      key={cartSubtotal}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="text-[22px] font-semibold text-neutral-900
                                 tracking-[-0.02em] tabular-nums"
                    >
                      ৳ {cartSubtotal.toLocaleString()}
                    </motion.span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    onClick={() => {
                      onClose();
                      setCurrentTab('checkout');
                    }}
                    className="relative w-full py-3.5 rounded-2xl overflow-hidden bg-neutral-900 text-white text-[14px] font-semibold tracking-[-0.005em] shadow-[0_14px_40px_-14px_rgba(0,0,0,0.55)] flex justify-center items-center gap-2 group"
                  >
                    {/* Animated sheen */}
                    <motion.span
                      aria-hidden
                      initial={{ x: '-120%' }}
                      animate={{ x: '120%' }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 2.4,
                        duration: 1.4,
                        ease: EASE_OUT,
                      }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg]"
                    />
                    <span className="relative z-10">{t('cart.checkout')}</span>
                    <span className="relative z-10 material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </motion.button>

                  <p className="mt-3 text-center text-[11px] text-neutral-400">
                    {language === 'en'
                      ? 'Secure checkout · Free returns within 7 days'
                      : 'নিরাপদ চেকআউট · ৭ দিনের মধ্যে ফ্রি রিটার্ন'}
                  </p>
                </motion.footer>
              )}
            </AnimatePresence>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}