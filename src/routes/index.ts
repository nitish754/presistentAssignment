import { Router } from 'express';
import { paymentRoutes } from './paymentRoutes';
import { subscriptionRoutes } from './subscriptionRoutes';

const router = Router();

// API routes
router.use('/payments', paymentRoutes);
router.use('/subscriptions', subscriptionRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      payments: '/payments',
      subscriptions: '/subscriptions'
    }
  });
});

export { router as apiRoutes }; 