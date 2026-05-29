import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import { Product } from '../models/Product';
import { config } from '../config/env';

vi.mock('../models/Product', () => {
  const ProductMock = {
    find: vi.fn(),
    findById: vi.fn(),
    countDocuments: vi.fn(),
    prototype: {
      save: vi.fn(),
    },
  };
  return { Product: ProductMock };
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

const generateUserToken = () => {
  return jwt.sign(
    { id: 'user123', isAdmin: false, role: 'customer', permissions: [] },
    config.JWT_ACCESS_SECRET
  );
};

describe('Product Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        { _id: 'p1', name: 'Product 1', salePrice: 100 },
        { _id: 'p2', name: 'Product 2', salePrice: 200 },
      ];

      const mockFind = {
        sort: vi.fn().mockReturnValue(mockProducts),
      };
      vi.mocked(Product.find).mockReturnValue(mockFind as any);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(2);
      expect(Product.find).toHaveBeenCalled();
    });

    it('should return paginated products if page query param is provided', async () => {
      const mockProducts = [{ _id: 'p1', name: 'Product 1', salePrice: 100 }];
      
      vi.mocked(Product.countDocuments).mockResolvedValue(15);
      const mockFind = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnValue(mockProducts),
      };
      vi.mocked(Product.find).mockReturnValue(mockFind as any);

      const res = await request(app).get('/api/products?page=2&limit=5');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.page).toBe(2);
      expect(res.body.pages).toBe(3);
      expect(res.body.total).toBe(15);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 404 if product ID is invalid format', async () => {
      const res = await request(app).get('/api/products/invalid-id');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return product details if product exists', async () => {
      const validId = '65b40cf61e721a9fe21a00a1'; // Valid 24-char ObjectId hex
      const mockProduct = { _id: validId, name: 'Product 1', salePrice: 100 };
      vi.mocked(Product.findById).mockResolvedValue(mockProduct as any);

      const res = await request(app).get(`/api/products/${validId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Product 1');
    });
  });

  describe('POST /api/products', () => {
    it('should deny access if no token is provided', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          description: 'A long product description at least 10 chars',
          image: 'https://example.com/image.png',
          originalPrice: 150,
          salePrice: 120,
          category: 'Gear',
        });

      expect(res.status).toBe(401);
    });

    it('should deny access if token is customer (non-admin)', async () => {
      const userToken = generateUserToken();
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'New Product',
          description: 'A long product description at least 10 chars',
          image: 'https://example.com/image.png',
          originalPrice: 150,
          salePrice: 120,
          category: 'Gear',
        });

      expect(res.status).toBe(403);
    });
  });
});
