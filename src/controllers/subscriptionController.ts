import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { SubscriptionRequest } from '../types/subscription';

export class SubscriptionController {
  private subscriptionService: SubscriptionService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
  }

  public createSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const subscription = await this.subscriptionService.createSubscription(req.body as SubscriptionRequest);
      res.status(201).json({ success: true, data: subscription });
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ success: false, error: 'Failed to create subscription' });
    }
  };

  public cancelSubscription = (req: Request, res: Response): void => {
    const { donorId } = req.params;
    const result = this.subscriptionService.cancelSubscription(donorId);
    if (result) {
      res.status(200).json({ success: true, message: 'Subscription cancelled' });
    } else {
      res.status(404).json({ success: false, error: 'Subscription not found' });
    }
  };

  public getSubscriptions = (_req: Request, res: Response): void => {
    const subs = this.subscriptionService.getActiveSubscriptions();
    res.status(200).json({ success: true, data: subs });
  };

  public getCharges = (_req: Request, res: Response): void => {
    const charges = this.subscriptionService.getCharges();
    res.status(200).json({ success: true, data: charges });
  };

  // For background job simulation
  public processRecurringCharges = async (): Promise<void> => {
    await this.subscriptionService.processRecurringCharges();
  };
} 