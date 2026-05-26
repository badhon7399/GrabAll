import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { PromoCode } from '../models/PromoCode';
import Settings from '../models/Settings';
import { AuthRequest, protect, admin } from '../middleware/auth';
import { config } from '../config/env';
import { validateRequest } from '../middleware/validate';
import { orderSchema, orderStatusSchema } from '../validators/schemas';
import { logAudit } from '../utils/audit';

const router = Router();

// Helper to check user auth optionally
const optionalAuth = (req: any, res: Response, next: any) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; isAdmin: boolean };
      req.user = decoded;
    } catch (error) {
      // Ignore token failure, proceed as guest
    }
  }
  next();
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Optional auth)
router.post('/', optionalAuth, validateRequest(orderSchema), async (req: any, res: Response): Promise<void> => {
  const { orderItems, shippingAddress, paymentMethod, guestDetails, promoCode } = req.body;

  try {
    // 1. Double check stock and recalculate actual price (prevent tampering)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400).json({ message: `Product not found: ${item.name}` });
        return;
      }

      if (product.stock < item.qty) {
        res.status(400).json({ 
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, requested: ${item.qty}` 
        });
        return;
      }

      const itemPrice = product.salePrice;
      calculatedSubtotal += itemPrice * item.qty;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        qty: item.qty,
        price: itemPrice,
        image: product.image,
      });
    }

    // 2. Validate and apply promo code server-side
    let discountAmount = 0;
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.trim().toUpperCase(), isActive: true });
      if (!promo) {
        res.status(400).json({ message: `Invalid or inactive promo code: ${promoCode}` });
        return;
      }

      discountAmount = Math.round(calculatedSubtotal * (promo.discount / 100));
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount);

    const orderData: any = {
      orderItems: verifiedItems,
      shippingAddress,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod || 'Cash On Delivery',
      promoCode: promoCode ? promoCode.trim().toUpperCase() : undefined,
      discountApplied: discountAmount > 0 ? discountAmount : undefined
    };

    if (req.user) {
      orderData.user = req.user.id;
    } else {
      if (!guestDetails) {
        res.status(400).json({ message: 'Guest details required for guest checkout' });
        return;
      }
      orderData.guestDetails = guestDetails;
    }

    // 3. Decrement stock for all items
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    // 4. Save the order
    const createdOrder = await Order.create(orderData);
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error occurred during checkout' });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, validateRequest(orderStatusSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(id);

    if (order) {
      const oldStatus = order.orderStatus;
      const oldPaymentStatus = order.paymentStatus;
      
      order.orderStatus = orderStatus || order.orderStatus;
      order.paymentStatus = paymentStatus || order.paymentStatus;

      const updatedOrder = await order.save();

      await logAudit(req, {
        action: 'UPDATE_ORDER_STATUS',
        targetType: 'Order',
        targetId: id,
        details: {
          oldStatus,
          newStatus: order.orderStatus,
          oldPaymentStatus,
          newPaymentStatus: order.paymentStatus
        }
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Public
router.put('/:id/pay', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.paymentStatus = 'Paid';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error during payment update' });
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const order = await Order.findById(id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
