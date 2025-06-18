export interface ChargeRequest {
  amount: number;
  currency: string;
  source: string;
  email: string;
}

export interface ChargeResponse {
  transactionId: string;
  provider: PaymentProvider;
  status: TransactionStatus;
  riskScore: number;
  explanation: string;
}

export interface Transaction extends ChargeResponse {
  timestamp: Date;
  request: ChargeRequest;
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BLOCKED = 'blocked'
}

export enum TransactionStatus {
  SUCCESS = 'success',
  BLOCKED = 'blocked',
  FAILED = 'failed'
}

export interface RiskAssessment {
  score: number;
  explanation: string;
  recommendedProvider: PaymentProvider;
} 