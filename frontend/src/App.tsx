import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  MotionConfig,
} from 'framer-motion';
import { useAuth, API_BASE_URL } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useLanguage } from './context/LanguageContext';
import type { Product, Order } from './types';

// Modular Components
import Header from './components/Header';
import HomeView from './components/HomeView';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import QuickViewModal from './components/QuickViewModal';
import ContactModal from './components/ContactModal';
import BKashModal from './components/BKashModal';
import ShopView from './components/ShopView';
import NeckMountsView from './components/NeckMountsView';
import TopSellingView from './components/TopSellingView';
import OffersDealsView from './components/OffersDealsView';
import NewArrivalView from './components/NewArrivalView';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';

// Lazy-loaded Views
const AuthView = React.lazy(() => import('./components/AuthView'));
const CheckoutView = React.lazy(() => import('./components/CheckoutView'));
const SuccessView = React.lazy(() => import('./components/SuccessView'));
const OrdersView = React.lazy(() => import('./components/OrdersView'));
const ContactView = React.lazy(() => import('./components/ContactView'));
const ProductDetailsView = React.lazy(() => import('./components/ProductDetailsView'));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout'));
const VerifyEmailView = React.lazy(() => import('./components/VerifyEmailView'));
const ResetPasswordView = React.lazy(() => import('./components/ResetPasswordView'));
const PrivacyPolicyView = React.lazy(() => import('./components/PrivacyPolicyView'));
const TermsOfServiceView = React.lazy(() => import('./components/TermsOfServiceView'));
const RefundPolicyView = React.lazy(() => import('./components/RefundPolicyView'));




/* ------------------------------------------------------------------ */
/* App                                                                */
/* ------------------------------------------------------------------ */
function App() {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, addToCart, clearCart } = useCart();
  const { language, t } = useLanguage();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTabState, setCurrentTabState] = useState<
    'home' | 'checkout' | 'orders' | 'success' | 'shop' | 'neck-mounts' | 'top-selling' | 'offers-deals' | 'new-arrival' | 'contact-us' | 'product-details' | 'auth' | 'admin' | 'verify-email' | 'reset-password' | 'privacy-policy' | 'terms-of-service' | 'refund-policy'
  >('home');

  const currentTab = currentTabState;

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  const setCurrentTab = useCallback((tab: typeof currentTabState) => {
    setCurrentTabState(tab);
    if (tab === 'home') navigate('/');
    else if (tab === 'contact-us') navigate('/contact');
    else if (tab === 'product-details') {
      if (detailsProduct) {
        navigate(`/product/${detailsProduct._id}`);
      }
    } else {
      navigate(`/${tab}`);
    }
  }, [navigate, detailsProduct]);

  // Catalog
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [sortFilter, setSortFilter] = useState<'none' | 'top-selling' | 'new-arrival' | 'offers-deals'>('none');


  // Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Checkout
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingEmail, setShippingEmail] = useState(user?.email || '');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  // Orders
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // whatsappNumber state
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('grabAllSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.whatsappNumber) return parsed.whatsappNumber;
      }
    } catch {}
    return '8801700000000';
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('grabAllSettings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.whatsappNumber) setWhatsappNumber(parsed.whatsappNumber);
        }
      } catch {}
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('settingsUpdated', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('settingsUpdated', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Sync route path to currentTab state
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentTabState('home');
    } else if (path === '/checkout') {
      setCurrentTabState('checkout');
    } else if (path === '/success') {
      setCurrentTabState('success');
    } else if (path === '/orders') {
      setCurrentTabState('orders');
    } else if (path === '/shop') {
      setCurrentTabState('shop');
    } else if (path === '/neck-mounts') {
      setCurrentTabState('neck-mounts');
    } else if (path === '/top-selling') {
      setCurrentTabState('top-selling');
    } else if (path === '/offers-deals') {
      setCurrentTabState('offers-deals');
    } else if (path === '/new-arrival') {
      setCurrentTabState('new-arrival');
    } else if (path === '/contact') {
      setCurrentTabState('contact-us');
    } else if (path.startsWith('/product/')) {
      const prodId = path.split('/')[2];
      if (prodId && products.length > 0) {
        const prod = products.find(p => p._id === prodId);
        if (prod) {
          setDetailsProduct(prod);
          setCurrentTabState('product-details');
        }
      }
    } else if (path === '/auth') {
      setCurrentTabState('auth');
    } else if (path === '/admin') {
      setCurrentTabState('admin');
    } else if (path === '/verify-email') {
      setCurrentTabState('verify-email');
    } else if (path === '/reset-password') {
      setCurrentTabState('reset-password');
    } else if (path === '/privacy-policy') {
      setCurrentTabState('privacy-policy');
    } else if (path === '/terms-of-service') {
      setCurrentTabState('terms-of-service');
    } else if (path === '/refund-policy') {
      setCurrentTabState('refund-policy');
    }
  }, [location.pathname, products]);

  // Scroll to top on tab or product selection change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab, detailsProduct]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('grabAllWishlist');
    if (storedWishlist) {
      try {
        setWishlistItems(JSON.parse(storedWishlist));
      } catch {
        localStorage.removeItem('grabAllWishlist');
      }
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.logo) localStorage.setItem('grabAllLogo', data.logo);
          if (data.banners) localStorage.setItem('grabAllBanners', JSON.stringify(data.banners));
          if (data.announcements) localStorage.setItem('grabAllAnnouncements', JSON.stringify(data.announcements));
          if (data.homepageSections) {
            localStorage.setItem('grabAllSectionProducts', JSON.stringify(data.homepageSections));
          }
          if (data.promotions) {
            localStorage.setItem('grabAllPromotions', JSON.stringify(data.promotions));
            window.dispatchEvent(new Event('promotionsUpdated'));
          }
          if (data.categories) {
            localStorage.setItem('grabAllCategories', JSON.stringify(data.categories));
            window.dispatchEvent(new Event('categoriesUpdated'));
          }
          if (data.storeSettings) {
            localStorage.setItem('grabAllSettings', JSON.stringify(data.storeSettings));
            if (data.storeSettings.whatsappNumber) {
              setWhatsappNumber(data.storeSettings.whatsappNumber);
            }
            window.dispatchEvent(new Event('settingsUpdated'));
          }
          if (data.faqs) {
            localStorage.setItem('grabAllFaqs', JSON.stringify(data.faqs));
            window.dispatchEvent(new Event('faqsUpdated'));
          }
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('logoUpdated'));
          window.dispatchEvent(new Event('bannersUpdated'));
          window.dispatchEvent(new Event('sectionsUpdated'));
        }
      } catch (err) {
        console.error('Error fetching settings from database:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (location.pathname.startsWith('/product/')) {
            const prodId = location.pathname.split('/')[2];
            const prod = data.find((p: any) => p._id === prodId);
            if (prod) {
              setDetailsProduct(prod);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [currentTab]);

  useEffect(() => {
    if (user) {
      setShippingName(user.name);
      setShippingEmail(user.email);
    } else {
      setShippingName('');
      setShippingEmail('');
    }
  }, [user]);



  /* --------------------------- Handlers --------------------------- */
  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const toggleWishlist = (product: Product) => {
    let updatedWishlist: Product[] = [];
    const isExist = wishlistItems.some((item) => item._id === product._id);
    if (isExist) {
      updatedWishlist = wishlistItems.filter((item) => item._id !== product._id);
      triggerToast(t('toast.removedFromWishlist'));
    } else {
      updatedWishlist = [...wishlistItems, product];
      triggerToast(t('toast.addedToWishlist'));
    }
    setWishlistItems(updatedWishlist);
    localStorage.setItem('grabAllWishlist', JSON.stringify(updatedWishlist));
  };

  const handlePlaceOrder = async (e: React.FormEvent, finalAmount?: number, promoCode?: string, paymentMethod?: string) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setCheckoutSubmitting(true);
    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      qty: item.qty,
      price: item.product.salePrice,
      image: item.product.image,
    }));
    const orderPayload: any = {
      orderItems,
      shippingAddress,
      totalAmount: finalAmount !== undefined ? finalAmount : cartSubtotal,
      paymentMethod: paymentMethod || 'Cash On Delivery',
      ...(promoCode ? { promoCode } : {}),
    };
    if (!user) {
      orderPayload.guestDetails = { name: shippingName, email: shippingEmail, phone: shippingPhone };
    }
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const order = await res.json();
        if (order.paymentMethod === 'bKash / Nagad') {
          setActivePaymentOrder(order);
        } else {
          setPlacedOrder(order);
          clearCart();
          setCurrentTab('success');
          triggerToast(t('toast.orderPlaced'));
        }
      } else {
        const errData = await res.json();
        triggerToast(errData.message || (language === 'en' ? 'Error placing order' : 'অর্ডার করতে ত্রুটি হয়েছে'));
      }
    } catch (err) {
      console.error('Checkout error:', err);
      triggerToast(language === 'en' ? 'Network error. Please try again.' : 'নেটওয়ার্ক ত্রুটি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const handleViewOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    setCurrentTab('orders');
    try {
      const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchKeyword);
    setCurrentTab('home');
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSearchKeyword('');
    setActiveSearch('');
    setSortFilter('none');
    setDetailsProduct(null);
    setCurrentTab('home');
  };





  /* ----------------------------- UI ------------------------------- */
  if (currentTab === 'admin') {
    if (!user || !user.isAdmin) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
          <div className="max-w-md w-full text-center space-y-4 bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
            <span className="material-symbols-outlined text-red-500 text-6xl">gpp_bad</span>
            <h1 className="text-2xl font-black">Access Denied</h1>
            <p className="text-slate-400 text-sm">
              You do not have the administrative privileges required to access this area.
            </p>
            <button
              onClick={() => setCurrentTab('home')}
              className="px-6 py-3 bg-[#FF4B7E] text-white font-bold rounded-2xl hover:bg-[#e03d6d] transition shadow-lg shadow-[#FF4B7E]/25 inline-flex items-center gap-2"
            >
              Go to Home Screen
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 font-body-md antialiased overflow-x-clip">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="fixed bottom-5 right-5 bg-deep-navy text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] border border-[#FF4B7E]/30 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[#FF4B7E]">check_circle</span>
              <span className="text-sm font-semibold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-semibold">Loading Admin Dashboard...</div>}>
          <AdminLayout setCurrentTab={setCurrentTab} triggerToast={triggerToast} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion={isMobile ? "always" : "never"}>
      <div className="min-h-screen bg-ice-white font-body-md text-on-surface antialiased flex flex-col overflow-x-clip pt-[124px] md:pt-[104px] pb-20 md:pb-8">
        {/* Skip to Main Content Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#0088FF] focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0088FF] font-semibold text-sm transition-all"
        >
          Skip to main content
        </a>

        {/* Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="fixed bottom-20 md:bottom-5 right-5 bg-deep-navy text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] border border-gold-accent/30 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-gold-accent">check_circle</span>
              <span className="text-sm font-semibold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Header */}
      <Header
        currentTab={currentTab}
        selectedCategory={selectedCategory}
        sortFilter={sortFilter}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleSearchSubmit={handleSearchSubmit}
        resetAllFilters={resetAllFilters}
        setSelectedCategory={setSelectedCategory}
        setSortFilter={setSortFilter}
        setCurrentTab={setCurrentTab}
        wishlistCount={wishlistItems.length}
        setIsWishlistOpen={setIsWishlistOpen}
        setIsCartOpen={setIsCartOpen}
        handleViewOrders={handleViewOrders}
        products={products}
        setDetailsProduct={setDetailsProduct}
        detailsProduct={detailsProduct}
      />

    <main id="main-content" className="flex-1 w-full max-w-container-max mx-auto px-gutter md:px-12 lg:px-20 py-8">
      <React.Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#0088FF] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-on-surface-variant">Loading page...</span>
        </div>
      }>
        {/* HOME */}
      {currentTab === 'home' && (
        <HomeView
          products={products}
          loadingProducts={loadingProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          wishlistItems={wishlistItems}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          triggerToast={triggerToast}
          setCurrentTab={setCurrentTab}
          setDetailsProduct={setDetailsProduct}
          resetAllFilters={resetAllFilters}
          activeSearch={activeSearch}
          setSelectedProduct={setSelectedProduct}
        />
      )}

{/* OTHER TABS (unchanged) */ }
{
  currentTab === 'checkout' && (
    <ProtectedRoute>
      <CheckoutView
        shippingName={shippingName}
        setShippingName={setShippingName}
        shippingEmail={shippingEmail}
        setShippingEmail={setShippingEmail}
        shippingPhone={shippingPhone}
        setShippingPhone={setShippingPhone}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        handlePlaceOrder={handlePlaceOrder}
        checkoutSubmitting={checkoutSubmitting}
        resetAllFilters={resetAllFilters}
      />
    </ProtectedRoute>
  )
}

{
  currentTab === 'success' && (
    <SuccessView placedOrder={placedOrder} shippingName={shippingName} resetAllFilters={resetAllFilters} />
  )
}

{
  currentTab === 'orders' && (
    <ProtectedRoute>
      <OrdersView userOrders={userOrders} loadingOrders={loadingOrders} resetAllFilters={resetAllFilters} />
    </ProtectedRoute>
  )
}

{
  currentTab === 'shop' && (
    <ShopView
      products={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      onToggleWishlist={toggleWishlist}
      wishlist={wishlistItems.map((w) => w._id)}
      initialCategory={selectedCategory}
    />
  )
}

{
  currentTab === 'neck-mounts' && (
    <NeckMountsView
      products={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      onToggleWishlist={toggleWishlist}
      wishlist={wishlistItems.map((w) => w._id)}
    />
  )
}

{
  currentTab === 'top-selling' && (
    <TopSellingView
      products={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      onToggleWishlist={toggleWishlist}
      wishlist={wishlistItems.map((w) => w._id)}
    />
  )
}

{
  currentTab === 'offers-deals' && (
    <OffersDealsView
      products={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      onToggleWishlist={toggleWishlist}
      wishlist={wishlistItems.map((w) => w._id)}
    />
  )
}

{
  currentTab === 'new-arrival' && (
    <NewArrivalView
      products={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      onToggleWishlist={toggleWishlist}
      wishlist={wishlistItems.map((w) => w._id)}
    />
  )
}

{ currentTab === 'contact-us' && <ContactView triggerToast={triggerToast} /> }

{
  currentTab === 'product-details' && detailsProduct && (
    <ProductDetailsView
      product={detailsProduct}
      allProducts={products}
      onAddToCart={(prod, qty) => {
        addToCart(prod, qty);
        triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
      }}
      onBuyNow={(prod, qty) => {
        addToCart(prod, qty);
        setCurrentTab('checkout');
      }}
      onToggleWishlist={toggleWishlist}
      isInWishlist={wishlistItems.some((item) => item._id === detailsProduct._id)}
      onSelectProduct={(prod) => {
        setDetailsProduct(prod);
        setCurrentTab('product-details');
      }}
      setCurrentTab={setCurrentTab}
    />
  )
}

{ currentTab === 'auth' && <AuthView setCurrentTab={setCurrentTab} triggerToast={triggerToast} /> }

{ currentTab === 'verify-email' && <VerifyEmailView setCurrentTab={setCurrentTab} /> }

{ currentTab === 'reset-password' && <ResetPasswordView setCurrentTab={setCurrentTab} triggerToast={triggerToast} /> }
{ currentTab === 'privacy-policy' && <PrivacyPolicyView resetAllFilters={resetAllFilters} /> }
{ currentTab === 'terms-of-service' && <TermsOfServiceView resetAllFilters={resetAllFilters} /> }
{ currentTab === 'refund-policy' && <RefundPolicyView resetAllFilters={resetAllFilters} /> }
      </React.Suspense>
    </main >

  {/* Trust Signals */}
  <section className="bg-white border-t border-b border-surface-container py-12">
    <div className="max-w-container-max mx-auto px-gutter md:px-12 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: 'local_shipping', title: language === 'en' ? 'Fast, Free Shipping' : 'দ্রুত ও ফ্রি শিপিং', desc: language === 'en' ? 'On orders over 4,000 BDT' : '৪,০০০ টাকার বেশি অর্ডারে' },
          { icon: 'schedule', title: language === 'en' ? 'Next Day Delivery' : 'পরের দিন ডেলিভারি', desc: language === 'en' ? 'Free over 5,000 BDT' : '৫,০০০ টাকার বেশি অর্ডারে ফ্রি' },
          { icon: 'shield_lock', title: language === 'en' ? 'Secure Payment' : 'নিরাপদ পেমেন্ট', desc: language === 'en' ? '100% Safe Checkout' : '১০০% নিরাপদ চেকআউট' },
          { icon: 'autorenew', title: language === 'en' ? '7-Day Returns' : '৭ দিনের রিটার্ন', desc: language === 'en' ? 'Hassle-free exchanges' : 'সহজ এক্সচেঞ্জ সুবিধা' },
        ].map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-4xl text-[#0088FF]">{s.icon}</span>
            <div>
              <h4 className="text-label-md text-deep-navy mb-1 uppercase font-bold tracking-wider">{s.title}</h4>
              <p className="text-body-sm text-on-surface-variant">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* Footer */ }
  < Footer
resetAllFilters = { resetAllFilters }
setCurrentTab = { setCurrentTab }
setSelectedCategory = { setSelectedCategory }
setSortFilter = { setSortFilter }
  />

  {/* Drawers & Modals */ }
  < CartDrawer isOpen = { isCartOpen } onClose = {() => setIsCartOpen(false)} setCurrentTab = { setCurrentTab } />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(prod) => {
          addToCart(prod, 1);
          triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
        }}
      />
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod) => {
          addToCart(prod, 1);
          setSelectedProduct(null);
          triggerToast(language === 'en' ? 'Added to cart!' : 'কার্টে যোগ করা হয়েছে!');
        }}
      />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} triggerToast={triggerToast} />
      {activePaymentOrder && (
        <BKashModal
          orderId={activePaymentOrder._id}
          amount={activePaymentOrder.totalAmount}
          paymentSignature={activePaymentOrder.paymentSignature}
          onSuccess={() => {
            setPlacedOrder(activePaymentOrder);
            setActivePaymentOrder(null);
            clearCart();
            setCurrentTab('success');
            triggerToast(t('toast.orderPlaced'));
          }}
          onClose={() => {
            setActivePaymentOrder(null);
          }}
        />
      )}

{/* Floating CTA - WhatsApp Button */}
<motion.a
  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
  target="_blank"
  rel="noopener noreferrer"
  initial={{ opacity: 0, scale: 0 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  className="fixed bottom-20 md:bottom-5 left-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#25D366]/40 flex items-center justify-center hover:bg-[#20ba59] transition-colors"
  aria-label={language === 'en' ? 'Contact Support on WhatsApp' : 'হোয়াটসঅ্যাপে আমাদের সাথে যোগাযোগ করুন'}
>
  <svg 
    viewBox="0 0 24 24" 
    className="w-7 h-7 fill-current" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.419 9.86-9.86.001-2.636-1.024-5.113-2.887-6.978C16.578 1.897 14.103.87 11.47.869c-5.444 0-9.866 4.418-9.868 9.861-.001 1.714.453 3.39 1.316 4.873L1.887 22l6.76-1.773-.5-.273zm10.516-7.53c-.302-.15-1.786-.88-2.063-.982-.277-.1-.478-.15-.679.15-.201.3-.778.98-.954 1.18-.176.2-.352.226-.654.076-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.083-.176-.3-.019-.462.13-.611.135-.134.302-.35.453-.525.15-.175.201-.3.302-.5.101-.2.05-.376-.026-.526-.075-.15-.679-1.636-.93-2.244-.244-.587-.492-.507-.679-.517-.176-.01-.377-.01-.577-.01s-.527.075-.803.375c-.277.3-1.054 1.03-1.054 2.515s1.08 2.92 1.23 3.12c.15.2 2.126 3.248 5.15 4.553.719.31 1.28.495 1.717.635.722.23 1.378.197 1.897.12.578-.087 1.787-.73 2.038-1.435.252-.705.252-1.31.176-1.435-.076-.12-.277-.195-.579-.345z"/>
  </svg>
  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
</motion.a>
      <CookieConsent />
      </div>
    </MotionConfig>
  );
}



export default App;