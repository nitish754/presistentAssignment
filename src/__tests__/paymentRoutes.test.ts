import request from 'supertest';
import app from '../index';

describe('Payment Routes', () => {
  describe('POST /api/payments/charge', () => {
    it('should process a valid payment request', async () => {
      const payload = {
        amount: 1000,
        currency: 'USD',
        source: 'tok_test',
        email: 'customer@example.com'
      };

      const response = await request(app)
        .post('/api/payments/charge')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('transactionId');
      expect(response.body.data).toHaveProperty('provider');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('riskScore');
      expect(response.body.data).toHaveProperty('explanation');
    });

    it('should block high-risk payments', async () => {
      const payload = {
        amount: 10000, // High amount
        currency: 'USD',
        source: 'tok_test',
        email: 'test@test.com' // Suspicious domain
      };

      const response = await request(app)
        .post('/api/payments/charge')
        .send(payload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('blocked');
      expect(response.body.data.riskScore).toBeGreaterThanOrEqual(0.5);
    });

    it('should reject invalid payment requests', async () => {
      const payload = {
        amount: -100, // Invalid amount
        currency: 'USD',
        source: 'tok_test',
        email: 'invalid-email' // Invalid email
      };

      const response = await request(app)
        .post('/api/payments/charge')
        .send(payload)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/payments/transactions', () => {
    it('should return list of transactions', async () => {
      const response = await request(app)
        .get('/api/payments/transactions')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 