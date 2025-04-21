const express = require('express');
const router = express.Router();

// In-memory cart for demo (replace with DB logic for real app)
let cart = [];

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
