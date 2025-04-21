import React, { useEffect, useState } from 'react';
import AdminSlides from './AdminSlides';
import axios from 'axios';

const SlidesPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <AdminSlides products={products} />
    </div>
  );
};

export default SlidesPage;
