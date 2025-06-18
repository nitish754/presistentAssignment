import { v4 as uuidv4 } from 'uuid';
import {
  ChargeRequest,
  ChargeResponse,
  Transaction,
  PaymentProvider,
  TransactionStatus,
  RiskAssessment
} from '../types/payment';
import { RiskAssessmentService } from './riskAssessmentService';

export class PaymentService {
  private transactions: Transaction[] = [];
  private riskAssessmentService: RiskAssessmentService;

  constructor() {
    this.riskAssessmentService = new RiskAssessmentService();
  }

  /**
   * Process a payment charge request
   */
  public async processCharge(request: ChargeRequest): Promise<ChargeResponse> {
    // Assess risk
    const riskAssessment = this.riskAssessmentService.assessRisk(request);

    // Create transaction
    const transaction = await this.createTransaction(request, riskAssessment);

    // Store transaction
    this.transactions.push(transaction);

    return {
      transactionId: transaction.transactionId,
      provider: transaction.provider,
      status: transaction.status,
      riskScore: transaction.riskScore,
      explanation: transaction.explanation
    };
  }

  /**
   * Get all stored transactions
   */
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  /**
   * Create a new transaction record
   */
  private async createTransaction(
    request: ChargeRequest,
    riskAssessment: RiskAssessment
  ): Promise<Transaction> {
    const transactionId = `txn_${uuidv4()}`;
    const provider = riskAssessment.recommendedProvider;
    const status = provider === PaymentProvider.BLOCKED
      ? TransactionStatus.BLOCKED
      : await this.simulatePaymentProcessing(provider);

    return {
      transactionId,
      provider,
      status,
      riskScore: riskAssessment.score,
      explanation: riskAssessment.explanation,
      timestamp: new Date(),
      request
    };
  }

  /**
   * Simulate payment processing with different providers
   */
  private async simulatePaymentProcessing(provider: PaymentProvider): Promise<TransactionStatus> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate 95% success rate
    return Math.random() < 0.95 ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
  }
} 