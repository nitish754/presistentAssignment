import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { validateBody } from '../middleware/validate';
import { chargeRequestSchema } from '../validation/paymentValidation';

const router = Router();
const paymentController = new PaymentController();

// POST /charge - Process a payment charge
router.post('/charge', validateBody(chargeRequestSchema), paymentController.handleChargeRequest);

// GET /transactions - Get all transactions
router.get('/transactions', paymentController.handleGetTransactions);

export { router as paymentRoutes }; 