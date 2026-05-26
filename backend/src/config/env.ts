import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate critical variables
if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI is not set in environment. Falling back to local default.');
}

if (!process.env.JWT_SECRET) {
  if (NODE_ENV === 'production') {
    throw new Error('CRITICAL ERROR: JWT_SECRET environment variable must be set in production!');
  } else {
    console.warn('WARNING: JWT_SECRET is not set. Using insecure local fallback for development.');
  }
}

export const config = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/graballgoods',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey12345_dev_fallback_change_me',
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
};
