import { Payment, PackageType } from '../../src/types';

export interface PaymentProvider {
  name: string;
  createCheckout(userId: string, packageType: PackageType): Promise<{ paymentId: string; checkoutUrl: string; amount: number; currency: string }>;
  verifyPayment(paymentId: string): Promise<boolean>;
  refund(paymentId: string): Promise<boolean>;
}

export class MashcoolPayProvider implements PaymentProvider {
  name = 'MASHCOOL_PAY';

  async createCheckout(userId: string, packageType: PackageType): Promise<{ paymentId: string; checkoutUrl: string; amount: number; currency: string }> {
    const amount = packageType === 'JOB_BLAST' ? 8 : 5;
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    return {
      paymentId,
      checkoutUrl: `/checkout/${paymentId}`,
      amount,
      currency: 'AZN',
    };
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    return true;
  }

  async refund(paymentId: string): Promise<boolean> {
    return true;
  }
}

export class PaymentService {
  private payments: Map<string, Payment> = new Map();
  private provider: PaymentProvider = new MashcoolPayProvider();

  constructor() {
    // Seed initial payment for Kamil Dadashov (JOB LUCK run)
    const seedPayment: Payment = {
      id: 'pay-seed-001',
      userId: 'usr-kamil-dadashov',
      packageType: 'JOB_LUCK',
      amount: 5,
      currency: 'AZN',
      provider: 'MASHCOOL_PAY',
      providerTransactionId: 'txn_azn_994120',
      status: 'COMPLETED',
      createdAt: '2026-08-20T10:20:00Z',
      updatedAt: '2026-08-20T10:21:00Z',
      searchRunId: 'run-seed-001',
    };
    this.payments.set(seedPayment.id, seedPayment);
  }

  async createCheckout(userId: string, packageType: PackageType): Promise<Payment> {
    const checkout = await this.provider.createCheckout(userId, packageType);
    const payment: Payment = {
      id: checkout.paymentId,
      userId,
      packageType,
      amount: checkout.amount,
      currency: 'AZN',
      provider: 'MASHCOOL_PAY',
      providerTransactionId: `txn_${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  // Server-side payment verification
  async completePayment(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error('Payment not found');

    const isValid = await this.provider.verifyPayment(paymentId);
    if (!isValid) {
      payment.status = 'FAILED';
      payment.updatedAt = new Date().toISOString();
      throw new Error('Payment verification failed on provider');
    }

    payment.status = 'COMPLETED';
    payment.updatedAt = new Date().toISOString();
    return payment;
  }

  getPayment(paymentId: string): Payment | undefined {
    return this.payments.get(paymentId);
  }

  getUserPayments(userId: string): Payment[] {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getTotalRevenue(): number {
    return Array.from(this.payments.values())
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
  }
}

export const paymentService = new PaymentService();
