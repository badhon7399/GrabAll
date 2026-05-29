import dotenv from 'dotenv';
import { z } from 'zod';

// Load env vars
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  MONGODB_URI: isProduction 
    ? z.string().url({ message: 'MONGODB_URI must be a valid URL in production' })
    : z.string().default('mongodb://localhost:27017/graballgoods'),
  JWT_ACCESS_SECRET: isProduction
    ? z.string().min(32, { message: 'JWT_ACCESS_SECRET must be at least 32 characters in production' })
    : z.string().default('supersecretkey12345_dev_fallback_change_me_access'),
  JWT_REFRESH_SECRET: isProduction
    ? z.string().min(32, { message: 'JWT_REFRESH_SECRET must be at least 32 characters in production' })
    : z.string().default('supersecretkey12345_dev_fallback_change_me_refresh'),
  CLOUDINARY_CLOUD_NAME: isProduction 
    ? z.string().min(1, { message: 'CLOUDINARY_CLOUD_NAME is required in production' }) 
    : z.string().optional(),
  CLOUDINARY_API_KEY: isProduction 
    ? z.string().min(1, { message: 'CLOUDINARY_API_KEY is required in production' }) 
    : z.string().optional(),
  CLOUDINARY_API_SECRET: isProduction 
    ? z.string().min(1, { message: 'CLOUDINARY_API_SECRET is required in production' }) 
    : z.string().optional(),
  ALLOWED_ORIGINS: isProduction
    ? z.string().min(1, { message: 'ALLOWED_ORIGINS is required in production' })
    : z.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  SMTP_HOST: isProduction
    ? z.string().min(1, { message: 'SMTP_HOST is required in production' })
    : z.string().optional(),
  SMTP_PORT: z.string().default('587').transform((val) => parseInt(val, 10)),
  SMTP_USER: isProduction
    ? z.string().min(1, { message: 'SMTP_USER is required in production' })
    : z.string().optional(),
  SMTP_PASS: isProduction
    ? z.string().min(1, { message: 'SMTP_PASS is required in production' })
    : z.string().optional(),
  SMTP_FROM: z.string().default('no-reply@graballgoods.com'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

const env = parsed.data;

export const config = {
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  MONGODB_URI: env.MONGODB_URI,
  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  CLOUDINARY: {
    CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
    API_KEY: env.CLOUDINARY_API_KEY,
    API_SECRET: env.CLOUDINARY_API_SECRET,
  },
  ALLOWED_ORIGINS: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  SMTP: {
    HOST: env.SMTP_HOST,
    PORT: env.SMTP_PORT,
    USER: env.SMTP_USER,
    PASS: env.SMTP_PASS,
    FROM: env.SMTP_FROM,
  },
};
