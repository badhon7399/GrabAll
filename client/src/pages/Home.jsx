import React, { useEffect, useState } from 'react';
import HeroCarousel from '../components/HeroCarousel';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

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

  return (
    <div>
      <HeroCarousel />
      <FeaturedCategories />
      <FeaturedProducts products={featuredProducts} />
      {/* Other home sections */}
    </div>
  );
};

export default Home;
