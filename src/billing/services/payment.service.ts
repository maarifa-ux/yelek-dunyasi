import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private configService: ConfigService) {}

  async processPayment(
    amount: number,
    currency: string,
    paymentMethod: string,
  ) {
    // Ödeme işleme mantığı burada yer alacak
    return {
      success: true,
      transactionId: `TR-${Date.now()}`,
      amount,
      currency,
      paymentMethod,
      timestamp: new Date(),
    };
  }
}
