import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress, Grid } from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const q = query.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q]);

  // Filter products by query (case-insensitive, match name or description)
  const filtered = products.filter(p =>
    q && (
      (p.name && p.name.toLowerCase().includes(q.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(q.toLowerCase()))
    )
  );

  // Quick view state
  const [quickView, setQuickView] = useState({ open: false, product: null });
  const handleView = (product) => {
    if (product && product._id) {
      window.location.href = `/product/${product._id}`;
    }
  };
  const handleQuickView = (product) => setQuickView({ open: true, product });
  const handleCloseQuickView = () => setQuickView({ open: false, product: null });

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={900} color="primary.main" mb={2}>
          Search Results
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Showing results for: <b>{q}</b>
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress color="primary" />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ py: 6 }}>
          No products found matching your search.
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {filtered.map(product => (
              <Grid item key={product._id || product.name} xs={12} sm={6} md={4}>
                <ProductCard 
                  product={product}
                  onView={handleView}
                  onQuickView={handleQuickView}
                />
              </Grid>
            ))}
          </Grid>
          <ProductQuickView
            open={quickView.open}
            product={quickView.product}
            onClose={handleCloseQuickView}
            onAddToCart={() => {}}
            onViewDetail={handleView}
          />
        </>
      )}
    </Container>
  );
};

export default Search;
