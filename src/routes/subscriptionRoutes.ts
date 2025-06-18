import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { validateBody } from '../middleware/validate';
import { subscriptionRequestSchema } from '../validation/subscriptionValidation';

const router = Router();
const controller = new SubscriptionController();

// POST /subscriptions - Create a new subscription
router.post('/', validateBody(subscriptionRequestSchema), controller.createSubscription);

// DELETE /subscriptions/:donorId - Cancel a subscription
router.delete('/:donorId', controller.cancelSubscription);

// GET /subscriptions - List all active subscriptions
router.get('/', controller.getSubscriptions);

// GET /subscriptions/charges - List all charges
router.get('/charges', controller.getCharges);

export { router as subscriptionRoutes }; 