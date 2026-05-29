import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { app } from '../server';
import { config } from '../config/env';
import { localUploadDir } from '../middleware/upload';

const generateAdminToken = () => {
  return jwt.sign(
    { id: 'admin123', isAdmin: true, role: 'admin', permissions: [] },
    config.JWT_ACCESS_SECRET
  );
};

afterAll(() => {
  fs.rmSync(localUploadDir, { recursive: true, force: true });
});

describe('Upload Endpoint', () => {
  it('uploads an image for admins and returns a usable URL', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${generateAdminToken()}`)
      .attach('image', Buffer.from('fake image bytes'), {
        filename: 'product.png',
        contentType: 'image/png',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Image uploaded successfully');
    expect(res.body.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/uploads\/.+product\.png$/);
  });

  it('rejects non-image uploads', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Authorization', `Bearer ${generateAdminToken()}`)
      .attach('image', Buffer.from('not an image'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Only JPG, PNG, WEBP, and GIF images are allowed.');
  });
});
