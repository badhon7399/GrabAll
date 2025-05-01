import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import ProductGrid from './pages/ProductGrid';
import ProductDetail from './pages/ProductDetail';
import HeroCarousel from './components/HeroCarousel';
import FeaturedCategories from './components/FeaturedCategories';
import CartPage from './pages/CartPage';
import AdminPanel from './admin/AdminPanel';
import SlidesPage from './admin/SlidesPage';
import Footer from './components/Footer';
import About from './pages/About';
import Home from './pages/Home';
import Contact from './pages/Contact';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import Checkout from './pages/Checkout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './admin/Dashboard';
import ProductTable from './admin/ProductTable';
import OrderTable from './admin/OrderTable';
import UserTable from './admin/UserTable';
import ContentManager from './admin/ContentManager';
import SettingsPanel from './admin/SettingsPanel';
import Search from './pages/Search';
import { useAuth } from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import MobileNavBar from './components/MobileNavBar';
import Favourites from './pages/Favourites';
import AdminLayout from './admin/AdminLayout'; // Import AdminLayout

function ShopPage({ handleAddToCart }) {
  const navigate = useNavigate();
  return (
    <ProductGrid
      onAddToCart={handleAddToCart}
      onView={product => navigate(`/product/${product._id}`)}
    />
  );
}

function CartPageWrapper(props) {
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout');
  };
  return <CartPage {...props} onCheckout={handleCheckout} />;
}

function ProductDetailRoute({ handleAddToCart }) {
  const { productId } = useParams();
  return <ProductDetail productId={productId} onAddToCart={handleAddToCart} />;
}

function AppContent({ cart, handleAddToCart, handleRemoveFromCart, handleClearCart, handlePlaceOrder }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      {/* Only show Header if not in admin route */}
      {!isAdminRoute && (
        <Header cartCount={Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.qty, 0) : 0} cartLink />
      )}
      <Box flex="1 0 auto" sx={{ background: theme.palette.background.default, width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', pb: { xs: 7, md: 0 } }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/favourites" element={<Favourites />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage handleAddToCart={handleAddToCart} />} />
            <Route path="/product/:productId" element={<ProductDetailRoute handleAddToCart={handleAddToCart} />} />
            <Route path="/cart" element={<CartPageWrapper 
              cartItems={cart}
              onAdd={item => handleAddToCart(item, 1)}
              onRemove={item => handleAddToCart(item, -1)}
              onDelete={handleRemoveFromCart}
              onClear={handleClearCart}
            />} />
            <Route path="/checkout" element={<Checkout cart={cart} onPlaceOrder={handlePlaceOrder} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/" />} />
            {/* Admin routes - NESTED under AdminLayout so sidebar/nav stays persistent */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminPanel />}> {/* Keeps compatibility for /admin */}
                <Route index element={<Dashboard />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductTable />} />
                <Route path="orders" element={<OrderTable />} />
                <Route path="users" element={<UserTable />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="settings" element={<SettingsPanel />} />
                <Route path="slides" element={<SlidesPage />} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </Box>
      {/* Mobile bottom nav bar */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <React.Suspense fallback={null}>
          <MobileNavBar />
        </React.Suspense>
      </Box>
      {/* Only show Footer if not in admin route */}
      {!isAdminRoute && <Footer />}
    </Box>
  );
}

function App() {
  const { user, token } = useAuth(); // Use both user and token from context
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    // Remove any invalid or default products from localStorage
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only keep items that are valid products (must have _id, name, price, qty)
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(item => item && item._id && item.name && typeof item.price === 'number' && typeof item.qty === 'number');
          if (filtered.length > 0) {
            localStorage.setItem('cart', JSON.stringify(filtered));
            return filtered;
          }
        }
      } catch {
        // Ignore parse errors
      }
      // If invalid, clear localStorage
      localStorage.removeItem('cart');
    }
    return [];
  });

  // On login, fetch cart from backend and merge
  React.useEffect(() => {
    if (user) {
      fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(serverCart => {
          // Merge local and server cart (prefer higher qty)
          const merged = [...serverCart];
          cart.forEach(localItem => {
            const idx = merged.findIndex(i => i._id === localItem._id);
            if (idx > -1) {
              merged[idx].qty = Math.max(merged[idx].qty, localItem.qty);
            } else {
              merged.push(localItem);
            }
          });
          setCart(Array.isArray(merged) ? merged : []);
        });
    }
  }, [user, token]);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Sync with backend if logged in
    if (user) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cart),
      });
    }
  }, [cart, user, token]);

  // Add to Cart handler
  const handleAddToCart = async (product, qty = 1) => {
    setCart(prev => {
      const items = Array.isArray(prev) ? prev : [];
      const existing = items.find(item => item._id === product._id);
      if (existing) {
        return items.map(item => item._id === product._id ? { ...item, qty: item.qty + qty } : item);
      } else {
        return [...items, { ...product, qty }];
      }
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, qty }),
      });
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleRemoveFromCart = (product) => {
    setCart((prev) => prev.filter((item) => item._id !== product._id));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    if (user) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify([]),
      });
    }
  };

  const handlePlaceOrder = async (orderDetails) => {
    if (!user || !token) {
      alert('You must be logged in to place an order.');
      return;
    }
    try {
      const orderPayload = {
        user: user._id,
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address: orderDetails.shipping.address,
          city: orderDetails.shipping.city,
          postalCode: orderDetails.shipping.zip,
          country: 'Bangladesh'
        },
        paymentMethod: 'Mobile',
        paymentResult: {
          id: orderDetails.payment.trxid,
          status: 'Pending',
          update_time: new Date().toISOString(),
          email_address: user.email
        },
        paymentMobile: orderDetails.payment.mobile,
        paymentTrxId: orderDetails.payment.trxid,
        itemsPrice: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        isPaid: false,
        isDelivered: false
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        setCart([]);
        localStorage.removeItem('cart');
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify([]),
        });
      } else {
        const err = await res.json();
        alert(err.message || 'Order failed');
      }
    } catch (error) {
      alert('Order failed: ' + error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent 
          cart={cart}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
          handleClearCart={handleClearCart}
          handlePlaceOrder={handlePlaceOrder}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;