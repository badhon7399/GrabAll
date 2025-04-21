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

function AppFooter() {
  const location = useLocation();
  const drawerWidth = 270;
  const isAdminRoute = location.pathname.startsWith('/admin');
  return <Footer sx={isAdminRoute ? { ml: { md: `${drawerWidth}px` } } : {}} />;
}

function ShopPage({ handleAddToCart }) {
  const navigate = useNavigate();
  return (
    <ProductGrid
      onAddToCart={handleAddToCart}
      onView={product => navigate(`/product/${product._id}`)}
    />
  );
}

function App() {
  // Simulated user state (replace with real auth logic)
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage or return null (not logged in)
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  // ...
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // On login, fetch cart from backend and merge
  React.useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${user.token}` }
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
  }, [user]);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Sync with backend if logged in
    if (user) {
      fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(cart),
      });
    }
  }, [cart, user]);

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
      await fetch('http://localhost:5000/api/cart', {
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
  const handleCheckout = () => {
    setCartDrawerOpen(false);
  };
  const handlePlaceOrder = () => {
    setCart([]);
  };

  // Clear cart handler
  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    if (user) {
      fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify([]),
      });
    }
  };


  const ProductDetailRoute = () => {
    const { productId } = useParams();
    return <ProductDetail productId={productId} onAddToCart={handleAddToCart} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box minHeight="100vh" display="flex" flexDirection="column">
          <Header cartCount={Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.qty, 0) : 0} cartLink />
          <Box flex="1 0 auto" sx={{ background: theme.palette.background.default, width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage handleAddToCart={handleAddToCart} />} />
                <Route path="/product/:productId" element={<ProductDetailRoute />} />
                <Route path="/cart" element={<CartPage 
                  cartItems={cart}
                  onAdd={item => handleAddToCart(item, 1)}
                  onRemove={item => handleAddToCart(item, -1)}
                  onDelete={handleRemoveFromCart}
                  onCheckout={handleCheckout}
                  onClear={handleClearCart}
                />} />
                <Route path="/checkout" element={<Checkout cart={cart} onPlaceOrder={handlePlaceOrder} />} />
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin/*" element={<AdminPanel />}>
  <Route index element={<Dashboard />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<ProductTable />} />
  <Route path="orders" element={<OrderTable />} />
  <Route path="users" element={<UserTable />} />
  <Route path="content" element={<ContentManager />} />
  <Route path="slides" element={<SlidesPage />} />
  <Route path="settings" element={<SettingsPanel />} />
  <Route path="*" element={<Navigate to="dashboard" replace />} />
</Route>
              </Routes>
            </ErrorBoundary>
          </Box>

          <AppFooter />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;