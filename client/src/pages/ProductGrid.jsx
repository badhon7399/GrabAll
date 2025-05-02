import { useEffect, useState } from 'react';
import { Grid, Container, Typography, CircularProgress, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductFilterBar from '../components/ProductFilterBar';
import ProductQuickView from '../components/ProductQuickView';
import { motion } from 'framer-motion';

const gridVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const ProductGrid = ({ onView = () => {}, onAddToCart = () => {} }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: 'All', sort: 'featured', price: [0, 1000] });
  const [quickView, setQuickView] = useState({ open: false, product: null });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // Filter and sort logic
  let filtered = products.filter(p => {
    const inCategory = filter.category === 'All' || (p.category && p.category.toLowerCase() === filter.category.toLowerCase());
    const inPrice = p.price >= filter.price[0] && p.price <= filter.price[1];
    return inCategory && inPrice;
  });
  if (filter.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (filter.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (filter.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  return (
    <Box sx={{
      py: { xs: 2, md: 8 },
      background: theme => theme.palette.background.default,
      minHeight: { xs: '70vh', md: 'auto' }
    }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', width: '100vw', px: { xs: 0, sm: 1, md: 0.5 } }}>
        <Typography variant="h2" fontWeight={800} mb={4} color="primary.main" align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' } }}>
          Shop Our Collection
        </Typography>
        <ProductFilterBar filter={filter} setFilter={setFilter} />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <motion.div variants={gridVariants} initial="hidden" animate="visible">
            <Grid container spacing={{ xs: 1, sm: 2, md: 2 }} sx={{ minHeight: { xs: '40vh', md: '50vh' }, px: 0 }}>
              {filtered.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 6 }}>
                    No products found in this range.
                  </Typography>
                </Grid>
              )}
              {filtered.map((product) => (
                <Grid item xs={6} sm={6} md={3} lg={3} key={product._id} sx={{ display: 'flex' }}>
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', p: 0 }}>
                    <ProductCard
                      product={product}
                      onView={() => onView(product)}
                      onQuickView={() => setQuickView({ open: true, product })}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
        <ProductQuickView
          open={quickView.open}
          product={quickView.product}
          onClose={() => setQuickView({ open: false, product: null })}
          onAddToCart={onAddToCart}
          onViewDetail={product => {
            if (product) onView(product);
            setQuickView({ open: false, product: null });
          }}
        />
      </Container>
    </Box>
  );
};

export default ProductGrid;
