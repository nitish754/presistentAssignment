import { ChargeRequest, RiskAssessment, PaymentProvider } from '../types/payment';

export class RiskAssessmentService {
  private static SUSPICIOUS_DOMAINS = ['test.com', '.ru'];
  private static HIGH_AMOUNT_THRESHOLD = 5000; // $5000
  private static RISK_THRESHOLD = 0.5;

  /**
   * Assess the risk of a payment request
   */
  public assessRisk(request: ChargeRequest): RiskAssessment {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Check amount
    if (request.amount >= RiskAssessmentService.HIGH_AMOUNT_THRESHOLD) {
      riskScore += 0.4;
      riskFactors.push('unusually large transaction amount');
    } else if (request.amount >= RiskAssessmentService.HIGH_AMOUNT_THRESHOLD / 2) {
      riskScore += 0.2;
      riskFactors.push('moderately high transaction amount');
    }

    // Check email domain
    const emailDomain = request.email.split('@')[1];
    if (RiskAssessmentService.SUSPICIOUS_DOMAINS.some(domain => emailDomain.includes(domain))) {
      riskScore += 0.3;
      riskFactors.push('suspicious email domain');
    }

    // Normalize risk score to be between 0 and 1
    riskScore = Math.min(1, riskScore);

    // Generate explanation
    const explanation = this.generateExplanation(riskScore, riskFactors);

    // Determine recommended provider
    const recommendedProvider = this.determineProvider(riskScore);

    return {
      score: riskScore,
      explanation,
      recommendedProvider
    };
  }

  /**
   * Generate a human-readable explanation of the risk assessment
   */
  private generateExplanation(riskScore: number, factors: string[]): string {
    if (factors.length === 0) {
      return 'This payment appears to be low-risk with no significant risk factors identified.';
    }

    const riskLevel = this.getRiskLevel(riskScore);
    const factorsText = factors.join(' and ');
    
    if (riskScore >= RiskAssessmentService.RISK_THRESHOLD) {
      return `This payment was blocked due to ${riskLevel} risk, based on ${factorsText}.`;
    }

    return `This payment was routed to ${this.determineProvider(riskScore)} due to ${riskLevel} risk, based on ${factorsText}.`;
  }

  /**
   * Get a descriptive risk level based on the score
   */
  private getRiskLevel(score: number): string {
    if (score >= 0.7) return 'very high';
    if (score >= 0.5) return 'high';
    if (score >= 0.3) return 'moderate';
    return 'low';
  }

  /**
   * Determine which payment provider to use based on risk score
   */
  private determineProvider(riskScore: number): PaymentProvider {
    if (riskScore >= RiskAssessmentService.RISK_THRESHOLD) {
      return PaymentProvider.BLOCKED;
    }
    
    // Route higher risk (but not blocked) transactions to PayPal
    if (riskScore >= 0.3) {
      return PaymentProvider.PAYPAL;
    }
    
    // Route lower risk transactions to Stripe
    return PaymentProvider.STRIPE;
  }
} 