import { v4 as uuidv4 } from 'uuid';
import { SubscriptionRequest, Subscription, SubscriptionCharge } from '../types/subscription';
import { LLMService } from './llmService';
import { PaymentService } from './paymentService';
import { ChargeRequest, ChargeResponse } from '../types/payment';

export class SubscriptionService {
  private subscriptions: Subscription[] = [];
  private charges: SubscriptionCharge[] = [];
  private llmService: LLMService;
  private paymentService: PaymentService;

  constructor() {
    this.llmService = new LLMService();
    this.paymentService = new PaymentService();
  }

  /**
   * Create a new subscription
   */
  public async createSubscription(request: SubscriptionRequest): Promise<Subscription> {
    const donorId = uuidv4();
    const { tags, summary } = await this.llmService.analyzeCampaign(request.campaignDescription);
    const subscription: Subscription = {
      donorId,
      amount: request.amount,
      currency: request.currency,
      source: request.source,
      email: request.email,
      campaignDescription: request.campaignDescription,
      interval: request.interval,
      tags,
      summary,
      active: true,
      createdAt: new Date(),
      lastChargedAt: undefined
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Cancel a subscription by donorId
   */
  public cancelSubscription(donorId: string): boolean {
    const sub = this.subscriptions.find(s => s.donorId === donorId && s.active);
    if (!sub) return false;
    sub.active = false;
    return true;
  }

  /**
   * Get all active subscriptions
   */
  public getActiveSubscriptions(): Subscription[] {
    return this.subscriptions.filter(s => s.active);
  }

  /**
   * Get all charges
   */
  public getCharges(): SubscriptionCharge[] {
    return this.charges;
  }

  /**
   * Simulate recurring charges for all active subscriptions
   */
  public async processRecurringCharges(): Promise<void> {
    const now = new Date();
    for (const sub of this.getActiveSubscriptions()) {
      if (this.shouldCharge(sub, now)) {
        const chargeReq: ChargeRequest = {
          amount: sub.amount,
          currency: sub.currency,
          source: sub.source,
          email: sub.email
        };
        const chargeRes: ChargeResponse = await this.paymentService.processCharge(chargeReq);
        const charge: SubscriptionCharge = {
          transactionId: chargeRes.transactionId,
          donorId: sub.donorId,
          amount: sub.amount,
          currency: sub.currency,
          provider: chargeRes.provider,
          status: chargeRes.status,
          riskScore: chargeRes.riskScore,
          explanation: chargeRes.explanation,
          chargedAt: now
        };
        this.charges.push(charge);
        sub.lastChargedAt = now;
        // Optionally log to console
        console.log(`[Subscription] Charged donor ${sub.donorId} for ${sub.amount} ${sub.currency}`);
      }
    }
  }

  /**
   * Determine if a subscription should be charged now
   */
  private shouldCharge(sub: Subscription, now: Date): boolean {
    if (!sub.lastChargedAt) return true;
    const msSinceLast = now.getTime() - sub.lastChargedAt.getTime();
    switch (sub.interval) {
      case 'daily':
        return msSinceLast >= 24 * 60 * 60 * 1000;
      case 'weekly':
        return msSinceLast >= 7 * 24 * 60 * 60 * 1000;
      case 'monthly':
        return msSinceLast >= 30 * 24 * 60 * 60 * 1000;
      default:
        return false;
    }
  }
} 