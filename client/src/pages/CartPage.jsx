import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Paper, IconButton, Divider, Fade, Select, MenuItem, TextField, InputAdornment
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SHIPPING_OPTIONS = [
  { label: 'Standard Delivery', value: 'standard', price: 5 },
  { label: 'Express Delivery', value: 'express', price: 15 },
  { label: 'Free Pickup', value: 'pickup', price: 0 },
];

const CartPage = ({ cartItems, onAdd, onRemove, onDelete, onCheckout, onClear }) => {
  const safeItems = Array.isArray(cartItems) ? cartItems : [];
  const [shipping, setShipping] = useState('standard');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const shippingPrice = SHIPPING_OPTIONS.find(opt => opt.value === shipping)?.price || 0;
  const itemCount = safeItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = safeItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Dummy promo logic: 'SAVE10' gives 10% off
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.10) : 0;
  const total = subtotal + shippingPrice - promoDiscount;

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid code');
    }
  };

  return (
    <Box sx={{ py: { xs: 2, md: 5 }, px: { xs: 1, md: 4 }, maxWidth: 1300, mx: 'auto', minHeight: '80vh' }}>
      <Grid container spacing={4}>
        {/* Cart Items Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" fontWeight={900}>Shopping Cart</Typography>
              <Typography variant="h6" color="text.secondary">{itemCount} Item{itemCount !== 1 ? 's' : ''}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {safeItems.length === 0 ? (
              <Fade in>
                <Box textAlign="center" mt={8}>
                  <img src="https://assets10.lottiefiles.com/packages/lf20_jzv1z4.json" alt="Empty Cart" style={{ width: 220, marginBottom: 24 }} onError={e => { e.target.onerror = null; e.target.src = 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png'; }} />
                  <Typography variant="h5" fontWeight={700} color="text.secondary" mb={2}>Your cart is empty</Typography>
                  <Button component={Link} to="/shop" variant="contained" size="large" color="primary" sx={{ fontWeight: 700 }}>
                    Continue Shopping
                  </Button>
                </Box>
              </Fade>
            ) : (
              <>
                <Grid container spacing={2}>
                  {safeItems.map(item => (
                    <Grid item xs={12} key={item._id}>
                      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', mr: 2, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="subtitle1" fontWeight={700} noWrap>{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{item.category || item.platform}</Typography>
                          <Button size="small" color="error" sx={{ mt: 1, textTransform: 'none' }} onClick={() => onDelete(item)}>
                            <Delete sx={{ fontSize: 18, mr: 0.5 }} /> Remove
                          </Button>
                        </Box>
                        <Box display="flex" alignItems="center" sx={{ minWidth: 110 }}>
                          <IconButton onClick={() => onRemove(item)} size="small" disabled={item.qty <= 1}><Remove /></IconButton>
                          <Typography mx={1} fontWeight={700}>{item.qty}</Typography>
                          <IconButton onClick={() => onAdd(item)} size="small"><Add /></IconButton>
                        </Box>
                        <Box sx={{ minWidth: 70, textAlign: 'right' }}>
                          <Typography fontWeight={700}>৳{typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                          <Typography fontWeight={700}>৳{(typeof item.price === 'number' && typeof item.qty === 'number') ? (item.price * item.qty).toFixed(2) : 'N/A'}</Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Button
                    component={Link}
                    to="/shop"
                    sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 700 }}
                    startIcon={<span style={{ fontSize: 18, marginRight: 4 }}>←</span>}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ fontWeight: 700, px: 4, borderRadius: 2 }}
                    onClick={onClear}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        {/* Order Summary Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, position: { md: 'sticky' }, top: 90 }}>
            <Typography variant="h5" fontWeight={800} mb={2} color="primary.main">Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary">ITEMS</Typography>
              <Typography fontWeight={700}>{itemCount}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary">SHIPPING</Typography>
              <Select
                size="small"
                value={shipping}
                onChange={e => setShipping(e.target.value)}
                sx={{ minWidth: 140, fontWeight: 700 }}
              >
                {SHIPPING_OPTIONS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label} - ৳{opt.price.toFixed(2)}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
              <Typography color="text.secondary">PROMO CODE</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  size="small"
                  placeholder="Enter your code"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  error={!!promoError}
                  helperText={promoError}
                  sx={{ minWidth: 120 }}
                  InputProps={{
                    endAdornment: promoApplied && (
                      <InputAdornment position="end" sx={{ color: 'success.main', fontWeight: 700 }}>✓</InputAdornment>
                    )
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 700, minWidth: 60 }}
                  onClick={handleApplyPromo}
                >
                  Apply
                </Button>
              </Box>
            </Box>
            {promoApplied && (
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="success.main">Promo Discount</Typography>
                <Typography color="success.main">-৳{promoDiscount.toFixed(2)}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography fontWeight={700}>TOTAL COST</Typography>
              <Typography fontWeight={900} fontSize={22} color="primary.main">৳{total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ fontWeight: 700, mt: 2, borderRadius: 2 }}
              onClick={onCheckout}
              disabled={safeItems.length === 0}
            >
              Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
