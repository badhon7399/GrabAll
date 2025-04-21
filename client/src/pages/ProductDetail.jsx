import { Box, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import StarRating from '../components/StarRating';

const mockReviews = [
  { user: 'Alice', rating: 5, text: 'Absolutely love this product! High quality and fast shipping.' },
  { user: 'Bob', rating: 4, text: 'Great value for the price. Would buy again.' },
  { user: 'Priya', rating: 5, text: 'Stylish and comfortable. Perfect for my living room.' },
];


import { useEffect, useState } from 'react';

const ProductDetail = ({ product, productId, onBack, onAddToCart, onViewRelated }) => {
  // Gallery selection must be at absolute top
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data));
  }, []);
  useEffect(() => {
    if (!product && productId) {
      fetch(`http://localhost:5000/api/products/${productId}`)
        .then(res => res.json())
        .then(data => setFetchedProduct(data));
    }
  }, [product, productId]);
  const displayProduct = product || fetchedProduct;
  if (!displayProduct) return null;
  // Demo: support multiple images if available
  const images = displayProduct.images && displayProduct.images.length ? displayProduct.images : [displayProduct.image];
  // Custom gallery logic for UI control
  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', py: { xs: 3, md: 4 }, px: { xs: 1, md: 4 } }}>
      <Grid container spacing={4} alignItems="flex-start" justifyContent="flex-start">
        {/* Left: Main Image and Thumbnails */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: 440, minHeight: 380, mb: 2, borderRadius: 4, p: 2, background: '#fafbfc', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
              <img
                src={images[selected]}
                alt={"Product"}
                style={{ width: '100%', maxWidth: 400, maxHeight: 340, objectFit: 'contain', borderRadius: 16, background: '#fff', display: 'block', marginLeft: 0 }}
              />
            </Paper>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: '100%', justifyContent: 'flex-start', px: 1 }}>
              {images.map((img, i) => (
                <Paper
                  key={i}
                  elevation={selected === i ? 4 : 1}
                  sx={{
                    borderRadius: 2,
                    border: selected === i ? '2px solid #febd69' : '2px solid transparent',
                    cursor: 'pointer',
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    transition: 'border 0.2s',
                  }}
                  onClick={() => setSelected(i)}
                >
                  <img src={img} alt={"thumb"} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8 }} />
                </Paper>
              ))}
            </Box>
          </Box>
        </Grid>
        {/* Right: Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: { md: 2 }, pr: { md: 3 }, py: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h3" fontWeight={900} gutterBottom sx={{ mb: 2, textAlign: 'left', width: '100%' }}>{displayProduct.name}</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ textAlign: 'left', width: '100%' }}>{displayProduct.category}</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
              <StarRating value={displayProduct.rating} />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ my: 2, textAlign: 'left', width: '100%' }}>{displayProduct.description}</Typography>
            <Typography variant="h4" color="primary.main" fontWeight={900} mb={4} sx={{ textAlign: 'left', width: '100%' }}>${displayProduct.price}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, width: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3 }}
                onClick={() => onAddToCart && onAddToCart(displayProduct)}
              >
                Add to Cart
              </Button>
              <Button variant="outlined" color="secondary" size="large" sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 3 }} onClick={() => navigate('/shop')}>
                Back to Shop
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Reviews Section */}
      <Box sx={{ mt: { xs: 3, md: 4 } }}>
        <Typography variant="h4" fontWeight={800} mb={2} color="primary.main">Customer Reviews</Typography>
        <Divider sx={{ mb: 3 }} />
        {mockReviews.map((r, i) => (
          <Box key={i} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700}>{r.user}</Typography>
            <StarRating value={r.rating} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{r.text}</Typography>
          </Box>
        ))}
      </Box>
      {/* Related Products */}
      <Box sx={{ mt: { xs: 3, md: 4 } }}>
        <Typography variant="h4" fontWeight={800} mb={2} color="primary.main">Related Products</Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {(allProducts.filter(
            p => p.category === displayProduct.category && p._id !== displayProduct._id
          ).slice(0, 3)).map((item) => (
            <Grid item xs={12} sm={4} key={item._id}>
              <Paper elevation={2} sx={{ borderRadius: 3, p: 2, textAlign: 'center', background: '#fff' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 8, marginBottom: 12 }} />
                <Typography variant="subtitle1" fontWeight={700}>{item.name}</Typography>
                <Typography variant="h6" color="primary.main" fontWeight={900}>${item.price}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  View
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetail;
