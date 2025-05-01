const express = require('express');
const router = express.Router();
const { addOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, addOrder); // Place new order
router.get('/user/:userId', protect, getUserOrders); // Get orders for a user
router.get('/', protect, admin, getAllOrders); // Admin: get all orders
router.patch('/:orderId/status', protect, admin, updateOrderStatus); // Admin: update order status

module.exports = router;
