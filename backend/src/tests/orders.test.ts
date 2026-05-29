import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import { app } from '../server';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { PromoCode } from '../models/PromoCode';
import { config } from '../config/env';

vi.mock('../models/Order', () => ({
  Order: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../models/Product', () => ({
  Product: {
    findById: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

vi.mock('../models/PromoCode', () => ({
  PromoCode: {
    findOne: vi.fn(),
  },
}));

vi.mock('../utils/audit', () => ({
  logAudit: vi.fn().mockResolvedValue(true),
}));

describe('Order Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    it('should create order successfully with correct stock and guest details', async () => {
      const mockProduct = {
        _id: '65b40cf61e721a9fe21a00a1',
        name: 'Product 1',
        salePrice: 100,
        stock: 5,
        image: 'https://example.com/image.jpg',
      };

      vi.mocked(Product.findById).mockResolvedValue(mockProduct as any);
      vi.mocked(Product.findOneAndUpdate).mockResolvedValue(mockProduct as any);
      vi.mocked(Order.create).mockImplementation(async (data: any) => ({
        ...data,
        _id: 'mockorder123',
        toJSON: function() { return this; }
      }));

      const res = await request(app)
        .post('/api/orders')
        .send({
          orderItems: [
            {
              product: '65b40cf61e721a9fe21a00a1',
              name: 'Product 1',
              qty: 2,
              price: 100,
              image: 'https://example.com/image.jpg',
            },
          ],
          shippingAddress: '123 Test Street, City',
          guestDetails: {
            name: 'Guest User',
            email: 'guest@example.com',
            phone: '1234567890',
          },
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.totalAmount).toBe(200);
      expect(res.body).toHaveProperty('paymentSignature');
      expect(Product.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should return 400 if stock is insufficient', async () => {
      const mockProduct = {
        _id: '65b40cf61e721a9fe21a00a1',
        name: 'Product 1',
        salePrice: 100,
        stock: 1,
        image: 'https://example.com/image.jpg',
      };

      vi.mocked(Product.findById).mockResolvedValue(mockProduct as any);

      const res = await request(app)
        .post('/api/orders')
        .send({
          orderItems: [
            {
              product: '65b40cf61e721a9fe21a00a1',
              name: 'Product 1',
              qty: 2,
              price: 100,
              image: 'https://example.com/image.jpg',
            },
          ],
          shippingAddress: '123 Test Street, City',
          guestDetails: {
            name: 'Guest User',
            email: 'guest@example.com',
            phone: '1234567890',
          },
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Insufficient stock');
    });
  });

  describe('PUT /api/orders/:id/pay', () => {
    const validOrderId = '65b40cf61e721a9fe21a00a9';

    it('should return 403 when updating order payment without auth/signature', async () => {
      const mockOrder = {
        _id: validOrderId,
        totalAmount: 200,
        paymentStatus: 'Pending',
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      const res = await request(app)
        .put(`/api/orders/${validOrderId}/pay`)
        .send({});

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized to pay for this order');
    });

    it('should update order payment to paid when valid signature is provided', async () => {
      const mockOrder = {
        _id: validOrderId,
        totalAmount: 200,
        paymentStatus: 'Pending',
        save: vi.fn().mockImplementation(function(this: any) {
          return Promise.resolve(this);
        }),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      // Generate the exact HMAC signature the server expects
      const expectedSignature = crypto
        .createHmac('sha256', config.JWT_ACCESS_SECRET)
        .update(validOrderId)
        .digest('hex');

      const res = await request(app)
        .put(`/api/orders/${validOrderId}/pay`)
        .send({
          paymentSignature: expectedSignature,
        });

      expect(res.status).toBe(200);
      expect(res.body.paymentStatus).toBe('Paid');
      expect(mockOrder.save).toHaveBeenCalled();
    });
  });
});
