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
    
    // multer-storage-cloudinary sets req.file.path as the Cloudinary URL
    const fileUrl = (req.file as any).path || (req.file as any).secure_url;
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: fileUrl
    });
  }
);

export default router;
