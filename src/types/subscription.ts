
import { PaymentProvider, TransactionStatus } from './payment';

export interface SubscriptionRequest {
  amount: number;
  currency: string;
  source: string;
  email: string;
  campaignDescription: string;
  interval: 'daily' | 'weekly' | 'monthly';
}

export interface Subscription {
  donorId: string;
  amount: number;
  currency: string;
  source: string;
  email: string;
  campaignDescription: string;
  interval: 'daily' | 'weekly' | 'monthly';
  tags: string[];
  summary: string;
  active: boolean;
  createdAt: Date;
  lastChargedAt?: Date;
}

export interface SubscriptionCharge {
  transactionId: string;
  donorId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: TransactionStatus;
  riskScore: number;
  explanation: string;
  chargedAt: Date;
}

export interface CampaignLLMOutput {
  tags: string[];
  summary: string;
} 