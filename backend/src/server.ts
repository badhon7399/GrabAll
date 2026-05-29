import './instrument';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { localUploadDir } from './middleware/upload';
import { config } from './config/env';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import uploadRoutes from './routes/upload';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';
import promoRoutes from './routes/promo';
import { checkEmailStatus } from './services/email';
import { checkCloudinaryStatus } from './middleware/upload';
import { mongoSanitize } from './middleware/sanitize';
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logger';
import { csrfProtection } from './middleware/csrf';

const app = express();

app.use(requestLogger);

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize);
app.use(csrfProtection);
app.use('/uploads', express.static(localUploadDir, {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

// Global Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});

// Stricter Auth Rate Limiting (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login/registration attempts, please try again after 15 minutes' },
});

// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const PORT = config.PORT;
const MONGODB_URI = config.MONGODB_URI;

const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    await mongoose.connect(MONGODB_URI, options);
    console.log('Successfully connected to MongoDB');
  } catch (err: any) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed: ${err.message}. Retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay * 1.5);
    } else {
      console.error('Critical Error: Could not connect to MongoDB after multiple attempts.');
      process.exit(1);
    }
  }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/promos', promoRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to GrabAllGoods API!' });
});

app.get('/api/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();
  
  const [cloudinaryStatus, emailStatus] = await Promise.all([
    checkCloudinaryStatus(),
    checkEmailStatus(),
  ]);

  const isHealthy = dbStatus === 'connected' && 
                     cloudinaryStatus !== 'error' && 
                     emailStatus !== 'error';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      cloudinary: cloudinaryStatus,
      email: emailStatus,
    },
    system: {
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
      },
      nodeVersion: process.version,
    }
  });
});

app.get('/api/health/ready', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1;
  const [cloudinaryStatus, emailStatus] = await Promise.all([
    checkCloudinaryStatus(),
    checkEmailStatus(),
  ]);

  const isReady = dbStatus && 
                  cloudinaryStatus !== 'error' && 
                  emailStatus !== 'error';

  if (isReady) {
    res.status(200).send('OK');
  } else {
    res.status(503).send('Service Unavailable');
  }
});

import * as Sentry from '@sentry/node';

// Sentry error handler must be before any other error-handling middleware
Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);

let server: any;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export { app };

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.info(`Received ${signal}. Starting graceful shutdown...`);
  
  const closeServer = () => new Promise<void>((resolve) => {
    if (server) {
      server.close(() => {
        console.info('Express server closed.');
        resolve();
      });
    } else {
      resolve();
    }
  });

  closeServer()
    .then(() => mongoose.connection.close())
    .then(() => {
      console.info('MongoDB connection closed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forceful shutdown triggered after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
