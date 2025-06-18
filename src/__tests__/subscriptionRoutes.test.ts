import request from 'supertest';
import app from '../index';

describe('Subscription Routes', () => {
  let donorId: string;

  it('should create a new subscription', async () => {
    const payload = {
      amount: 1500,
      currency: 'USD',
      source: 'tok_test',
      email: 'donor@example.com',
      campaignDescription: 'Disaster relief for Nepal. Help children and families.',
      interval: 'daily'
    };
    const response = await request(app)
      .post('/api/subscriptions')
      .send(payload)
      .expect(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('donorId');
    expect(response.body.data).toHaveProperty('tags');
    expect(response.body.data).toHaveProperty('summary');
    donorId = response.body.data.donorId;
  });

  it('should list all active subscriptions', async () => {
    const response = await request(app)
      .get('/api/subscriptions')
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should list all charges (may be empty initially)', async () => {
    const response = await request(app)
      .get('/api/subscriptions/charges')
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should cancel a subscription', async () => {
    const response = await request(app)
      .delete(`/api/subscriptions/${donorId}`)
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Subscription cancelled');
  });

  it('should return 404 when cancelling a non-existent subscription', async () => {
    const response = await request(app)
      .delete('/api/subscriptions/nonexistentid')
      .expect(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Subscription not found');
  });

  it('should reject invalid subscription requests', async () => {
    const payload = {
      amount: -100,
      currency: 'USD',
      source: 'tok_test',
      email: 'invalid-email',
      campaignDescription: '',
      interval: 'yearly' // invalid interval
    };
    const response = await request(app)
      .post('/api/subscriptions')
      .send(payload)
      .expect(400);
    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');
  });
}); 