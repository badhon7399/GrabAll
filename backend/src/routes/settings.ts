import { Router, Request, Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest, protect, admin } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { settingsSchema } from '../validators/schemas';
import { logAudit } from '../utils/audit';

const router = Router();

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    } else {
      let changed = false;
      if (!settings.banners || settings.banners.length === 0) {
        settings.banners = (Settings.schema.path('banners') as any).defaultValue();
        changed = true;
      }
      if (!settings.promotions || !settings.promotions.promo1) {
        settings.promotions = (Settings.schema.path('promotions') as any).defaultValue();
        changed = true;
      }
      if (changed) {
        await settings.save();
      }
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, validateRequest(settingsSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    const { logo, banners, announcements, homepageSections, storeSettings, promos, promotions, categories } = req.body;

    if (logo !== undefined) settings.logo = logo;
    if (banners !== undefined) settings.banners = banners;
    if (announcements !== undefined) settings.announcements = announcements;
    if (homepageSections !== undefined) settings.homepageSections = homepageSections;
    if (storeSettings !== undefined) settings.storeSettings = storeSettings;
    if (promos !== undefined) settings.promos = promos;
    if (promotions !== undefined) settings.promotions = promotions;
    if (categories !== undefined) settings.categories = categories;

    const updatedSettings = await settings.save();
    
    // Log settings change
    await logAudit(req, {
      action: 'UPDATE_SETTINGS',
      targetType: 'Settings',
      targetId: settings._id.toString(),
      details: {
        keysChanged: Object.keys(req.body)
      }
    });

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
