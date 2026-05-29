import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { AuthRequest, protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

const handleUpload = (req: AuthRequest, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large. Max size is 5MB.'
        : err.message;
      res.status(400).json({ message });
      return;
    }

    res.status(400).json({ message: err.message || 'Failed to upload image.' });
  });
};

const getLocalFileUrl = (req: AuthRequest): string | undefined => {
  if (!req.file || !(req.file as Express.Multer.File).filename) {
    return undefined;
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || req.protocol;
  return `${protocol}://${req.get('host')}/uploads/${(req.file as Express.Multer.File).filename}`;
};

const getProviderFileUrl = (file: Express.Multer.File): string | undefined => {
  const possibleUrl = 
    (file as any).secure_url ||
    (file as any).url ||
    (file as any).location ||
    (file as any).path;

  return typeof possibleUrl === 'string' && /^https?:\/\//.test(possibleUrl)
    ? possibleUrl
    : undefined;
};

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  handleUpload,
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

    // Extract the storage provider URL, falling back to a local static file URL in development.
    const fileUrl = getProviderFileUrl(req.file) || getLocalFileUrl(req);

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
