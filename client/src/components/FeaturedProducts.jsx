import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const sectionBg = {
  width: '100%',
  background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)',
  padding: { xs: '16px 0 48px 0', sm: '64px 0 48px 0' },
  margin: 0,
};

const FeaturedProducts = ({ products = [], onView, onAddToCart }) => {
  // Fallbacks to ensure ProductCard always gets a function
  const handleView = onView || (() => {});
  const handleQuickView = onAddToCart || (() => {});
  console.log('FeaturedProducts received products:', products);
  return (
    <Box sx={sectionBg}>
      <Typography
        variant="h3"
        fontWeight={900}
        align="center"
        color="primary.main"
        mb={4}
        sx={{
          fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
          letterSpacing: '-1.5px',
        }}
      >
        Featured Products
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 4, md: 3 }} justifyContent="center" sx={{ px: { xs: 0.5, sm: 2, md: 1 } }}>
        {products.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ width: '100%' }}>
            No featured products selected.
          </Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={6} sm={6} md={3} lg={3} key={product._id}>
              <ProductCard product={product} onView={handleView} onQuickView={handleQuickView} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
