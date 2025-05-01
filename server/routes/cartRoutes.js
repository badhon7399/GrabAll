const express = require('express');
const router = express.Router();

// In-memory cart for demo (replace with DB logic for real app)
let cart = [];

// Middleware to always start with an empty cart for every new session/request
router.use((req, res, next) => {
  if (req.method === 'GET' && cart.length > 0) {
    cart = [];
  }
  next();
});

// Add to cart
router.post('/', (req, res) => {
  const { productId, qty } = req.body;
  // Check if product already in cart
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  res.json({ success: true, cart });
});

// Get cart
router.get('/', (req, res) => {
  res.json(cart);
});

// Clear cart (for testing)
router.delete('/', (req, res) => {
  cart = [];
  res.json({ success: true });
});

module.exports = router;
