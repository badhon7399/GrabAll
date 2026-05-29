import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import Settings from '../models/Settings';
import { config } from '../config/env';

vi.mock('../models/Settings', () => {
  const mockSettingsInstance = {
    _id: 'settings123',
    logo: 'https://raw.githubusercontent.com/shadcn.png',
    banners: [],
    announcements: [],
    homepageSections: {},
    storeSettings: {},
    promos: [],
    promotions: {
      promo1: {
        badge: 'New Arrivals',
        title: 'Upgrade Your Gear.',
        desc: 'Discover professional-grade tools.',
        ctaText: 'Shop',
        image: 'https://example.com/promo1.png',
        categoryTarget: 'Content Gear',
      },
      promo2: {
        badge: 'Bundle',
        title: 'Starter Kits',
        desc: 'Save 25%',
        ctaText: 'Build',
        bgGradientFrom: '#9333ea',
        bgGradientTo: '#4f46e5',
        categoryTarget: 'All',
      },
    },
    categories: [],
    faqs: [],
    save: vi.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    }),
  };

  const SettingsMock = {
    findOne: vi.fn().mockResolvedValue(mockSettingsInstance),
    create: vi.fn().mockResolvedValue(mockSettingsInstance),
    schema: {
      path: vi.fn().mockReturnValue({
        defaultValue: vi.fn().mockReturnValue([]),
      }),
    },
  };
  return { default: SettingsMock };
});

vi.mock('../utils/audit', () => ({
  logAudit: vi.fn().mockResolvedValue(true),
}));

const generateAdminToken = () => {
  return jwt.sign(
    { id: 'admin123', isAdmin: true, role: 'admin', permissions: [] },
    config.JWT_ACCESS_SECRET
  );
};

describe('Settings Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/settings', () => {
    it('should return settings', async () => {
      const res = await request(app).get('/api/settings');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('logo');
      expect(res.body).toHaveProperty('promotions');
      expect(res.body.promotions.promo1.title).toBe('Upgrade Your Gear.');
    });
  });

  describe('PUT /api/settings', () => {
    it('should update settings successfully including promotions when authorized as admin', async () => {
      const token = generateAdminToken();
      const updatedPromo1 = {
        badge: 'Summer Sale',
        title: 'Hot Gear Update',
        desc: 'Save big on summer gear',
        ctaText: 'Shop Now',
        image: 'https://example.com/summer.png',
        categoryTarget: 'Summer',
      };

      const res = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          logo: 'https://example.com/new-logo.png',
          promotions: {
            promo1: updatedPromo1,
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.logo).toBe('https://example.com/new-logo.png');
      expect(res.body.promotions.promo1.title).toBe('Hot Gear Update');
    });

    it('should reject invalid promotions image URL format', async () => {
      const token = generateAdminToken();
      const res = await request(app)
        .put('/api/settings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          promotions: {
            promo1: {
              image: 'not-a-valid-url',
            },
          },
        });

      expect(res.status).toBe(400);
      expect(JSON.stringify(res.body.errors)).toContain('Promo 1 image must be a valid URL');
    });
  });
});
