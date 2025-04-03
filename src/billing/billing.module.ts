import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PaymentService } from './services/payment.service';

@Module({
  imports: [ConfigModule],
  controllers: [BillingController],
  providers: [BillingService, PaymentService],
  exports: [BillingService],
})
export class BillingModule {}
