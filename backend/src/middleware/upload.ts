import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env';

export const localUploadDir = path.resolve(process.cwd(), 'uploads');
const hasCloudinaryConfig = Boolean(
  config.CLOUDINARY.CLOUD_NAME &&
  config.CLOUDINARY.API_KEY &&
  config.CLOUDINARY.API_SECRET
);
const isTestRuntime = config.NODE_ENV === 'test' || process.env.VITEST === 'true';

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
});

// Configure Multer storage for Cloudinary
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'graballgoods',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    };
  },
});

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(localUploadDir, { recursive: true });
    cb(null, localUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'image';
    cb(null, `${Date.now()}-${safeBase}${ext}`);
  },
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const upload = multer({
  storage: hasCloudinaryConfig && !isTestRuntime ? cloudinaryStorage : localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'));
      return;
    }
    cb(null, true);
  },
});

export const checkCloudinaryStatus = async (): Promise<'connected' | 'not_configured' | 'error'> => {
  if (!config.CLOUDINARY.CLOUD_NAME || !config.CLOUDINARY.API_KEY || !config.CLOUDINARY.API_SECRET) {
    return 'not_configured';
  }
  try {
    await cloudinary.api.ping();
    return 'connected';
  } catch (error) {
    return 'error';
  }
};
