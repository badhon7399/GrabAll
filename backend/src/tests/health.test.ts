import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { checkCloudinaryStatus } from '../middleware/upload';
import { checkEmailStatus } from '../services/email';

vi.mock('../middleware/upload', () => ({
  checkCloudinaryStatus: vi.fn(),
  localUploadDir: '/tmp/graball-test-uploads',
  upload: {
    single: () => (req: any, res: any, next: any) => next(),
  },
}));

vi.mock('../services/email', () => ({
  checkEmailStatus: vi.fn(),
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

// Mock mongoose connection state
vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);

describe('Health & Readiness Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status if database, cloudinary, and email are all healthy', async () => {
      vi.mocked(checkCloudinaryStatus).mockResolvedValue('connected');
      vi.mocked(checkEmailStatus).mockResolvedValue('connected');

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.services.database).toBe('connected');
      expect(res.body.services.cloudinary).toBe('connected');
      expect(res.body.services.email).toBe('connected');
    });

    it('should return 503 and unhealthy status if database is disconnected', async () => {
      // Mock database disconnected
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(0);
      vi.mocked(checkCloudinaryStatus).mockResolvedValue('connected');
      vi.mocked(checkEmailStatus).mockResolvedValue('connected');

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('unhealthy');
      expect(res.body.services.database).toBe('disconnected');
      
      // Restore readiness
      vi.spyOn(mongoose.connection, 'readyState', 'get').mockReturnValue(1);
    });

    it('should return 503 if Cloudinary has an error', async () => {
      vi.mocked(checkCloudinaryStatus).mockResolvedValue('error');
      vi.mocked(checkEmailStatus).mockResolvedValue('connected');

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('unhealthy');
      expect(res.body.services.cloudinary).toBe('error');
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return 200 OK when services are ready', async () => {
      vi.mocked(checkCloudinaryStatus).mockResolvedValue('connected');
      vi.mocked(checkEmailStatus).mockResolvedValue('connected');

      const res = await request(app).get('/api/health/ready');

      expect(res.status).toBe(200);
      expect(res.text).toBe('OK');
    });

    it('should return 503 Service Unavailable when a critical service fails', async () => {
      vi.mocked(checkCloudinaryStatus).mockResolvedValue('error');
      vi.mocked(checkEmailStatus).mockResolvedValue('connected');

      const res = await request(app).get('/api/health/ready');

      expect(res.status).toBe(503);
      expect(res.text).toBe('Service Unavailable');
    });
  });
});
