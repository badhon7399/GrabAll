import { Router, Response } from 'express';
import { AuthRequest, protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { config } from '../config/env';

const router = Router();

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  (req: AuthRequest, res: Response, next) => {
    // Check if Cloudinary credentials are configured
    if (!config.CLOUDINARY.CLOUD_NAME || !config.CLOUDINARY.API_KEY || !config.CLOUDINARY.API_SECRET) {
      res.status(500).json({ 
        message: 'Cloudinary credentials are not configured in the server environment (.env file).' 
      });
      return;
    }
    next();
  },
  upload.single('image'),
  (req: AuthRequest, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    
    // Log the file object structure for easier troubleshooting
    console.log('[Upload Route] Received file from Multer:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      keys: Object.keys(req.file),
      path: (req.file as any).path,
      secure_url: (req.file as any).secure_url,
      url: (req.file as any).url,
      location: (req.file as any).location
    });

    // Extract the Cloudinary URL using multiple property fallbacks
    const fileUrl = 
      (req.file as any).path || 
      (req.file as any).secure_url || 
      (req.file as any).url ||
      (req.file as any).location;

    if (!fileUrl) {
      console.error('[Upload Route] Error: Could not extract URL from uploaded file object.');
      res.status(500).json({ message: 'Upload succeeded but no valid image URL was returned by storage provider.' });
      return;
    }
    
    console.log('[Upload Route] Successfully extracted file URL:', fileUrl);

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: fileUrl
    });
  }
);

export default router;
