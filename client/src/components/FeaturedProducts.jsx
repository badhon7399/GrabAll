import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const sectionBg = {
  width: '100%',
  background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)',
  padding: '64px 0 48px 0',
  margin: 0,
};

const FeaturedProducts = ({ products = [], onView, onAddToCart }) => {
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
      <Grid container spacing={4} justifyContent="center">
        {products.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center" sx={{ width: '100%' }}>
            No featured products selected.
          </Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} onView={onView} onQuickView={onAddToCart} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default FeaturedProducts;
