import { Router, Response } from 'express';
import { protect, authorize, AuthRequest } from '../middleware/auth';
import { PromoCode } from '../models/PromoCode';

const router = Router();

// Validate a promo code (Public/authenticated checkout users)
router.post('/validate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ message: 'Promo code is required' });
      return;
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promo) {
      res.status(404).json({ message: 'Invalid or expired promo code' });
      return;
    }

    res.json({
      code: promo.code,
      discount: promo.discount,
      message: `Code applied successfully! You saved ${promo.discount}%`
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error validating promo code' });
  }
});

// Admin/Manager: Get all promo codes
router.get('/admin', protect, authorize('manager', 'admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const promos = await PromoCode.find({}).sort({ createdAt: -1 });
    res.json(promos);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error fetching promo codes' });
  }
});

// Admin/Manager: Create a promo code
router.post('/admin', protect, authorize('manager', 'admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, discount, isActive } = req.body;
    if (!code || discount === undefined) {
      res.status(400).json({ message: 'Code and discount are required' });
      return;
    }

    const uppercaseCode = code.toUpperCase().trim();
    const existing = await PromoCode.findOne({ code: uppercaseCode });
    if (existing) {
      res.status(400).json({ message: 'Promo code already exists' });
      return;
    }

    const promo = new PromoCode({
      code: uppercaseCode,
      discount: Number(discount),
      isActive: isActive !== undefined ? isActive : true
    });

    await promo.save();
    res.status(201).json(promo);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error creating promo code' });
  }
});

// Admin/Manager: Toggle active state / Update a promo code
router.put('/admin/:id', protect, authorize('manager', 'admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive, discount } = req.body;

    const promo = await PromoCode.findById(id);
    if (!promo) {
      res.status(404).json({ message: 'Promo code not found' });
      return;
    }

    if (isActive !== undefined) promo.isActive = isActive;
    if (discount !== undefined) promo.discount = Number(discount);

    await promo.save();
    res.json(promo);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error updating promo code' });
  }
});

// Admin/Manager: Delete a promo code
router.delete('/admin/:id', protect, authorize('manager', 'admin', 'super_admin', 'demo_admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const promo = await PromoCode.findByIdAndDelete(id);
    if (!promo) {
      res.status(404).json({ message: 'Promo code not found' });
      return;
    }
    res.json({ message: 'Promo code deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Error deleting promo code' });
  }
});

export default router;
