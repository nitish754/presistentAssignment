import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { ChargeRequest } from '../types/payment';
import { isValidEmail } from '../utils/email';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Handle charge request
   */
  public handleChargeRequest = (req: Request, res: Response): Promise<void> => {
    return (async () => {
      try {

        // Process charge
        const result = await this.paymentService.processCharge(req.body);

        res.status(200).json({
          success: true,
          data: result
        });
      } catch (error) {
        console.error('Error processing charge:', error);
        res.status(500).json({
          success: false,
          error: {
            message: 'Internal server error processing payment'
          }
        });
      }
    })();
  };

  /**
   * Handle get transactions request
   */
  public handleGetTransactions = (req: Request, res: Response): Promise<void> => {
    return (async () => {
      try {
        const transactions = this.paymentService.getTransactions();
        res.status(200).json({
          success: true,
          data: transactions
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
          success: false,
          error: {
            message: 'Internal server error fetching transactions'
          }
        });
      }
    })();
  };

  /**
   * Validate charge request payload
   */
  private validateChargeRequest(payload: any): string | null {
    if (!payload) {
      return 'Request body is required';
    }

    const requiredFields: (keyof ChargeRequest)[] = ['amount', 'currency', 'source', 'email'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return `${field} is required`;
      }
    }

    if (typeof payload.amount !== 'number' || payload.amount <= 0) {
      return 'amount must be a positive number';
    }

    if (typeof payload.currency !== 'string' || payload.currency.length !== 3) {
      return 'currency must be a 3-letter ISO currency code';
    }

    if (typeof payload.email !== 'string' || !isValidEmail(payload.email)) {
      return 'email must be a valid email address';
    }

    return null;
  }
} 