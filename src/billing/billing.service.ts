import { Injectable } from '@nestjs/common';
import { PaymentService } from './services/payment.service';

@Injectable()
export class BillingService {
  constructor(private paymentService: PaymentService) {}

  async createPayment(
    userId: string,
    amount: number,
    currency: string,
    method: string,
  ) {
    const paymentResult = await this.paymentService.processPayment(
      amount,
      currency,
      method,
    );

    // Ödeme kaydı işlemleri burada yapılabilir

    return paymentResult;
  }
}
