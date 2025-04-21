import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import ProductQuickView from '../components/ProductQuickView';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickView, setQuickView] = useState({ open: false, product: null });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured products from backend
    axios.get('http://localhost:5000/api/products/featured')
      .then(res => {
        console.log('API /api/products/featured response:', res.data);
        setFeaturedProducts(res.data);
      })
      .catch((err) => {
        console.error('Error fetching featured products:', err);
        setFeaturedProducts([]);
      });
  }, []);

  useEffect(() => {
    console.log('featuredProducts state:', featuredProducts);
  }, [featuredProducts]);

  const handleView = (product) => {
    if (product && product._id) {
      navigate(`/product/${product._id}`);
    }
  };
  const handleQuickView = (product) => {
    setQuickView({ open: true, product });
  };
  const handleCloseQuickView = () => setQuickView({ open: false, product: null });

  return (
    <div>
      <HeroCarousel />
      <FeaturedCategories />
      <FeaturedProducts products={featuredProducts} onView={handleView} onAddToCart={handleQuickView} />
      <ProductQuickView
        open={quickView.open}
        product={quickView.product}
        onClose={handleCloseQuickView}
        onAddToCart={() => {}}
        onViewDetail={handleView}
      />
      {/* Other home sections */}
    </div>
  );
};

export default Home;
