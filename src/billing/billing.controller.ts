import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Ödeme')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ödeme işlemi başlat' })
  createPayment(
    @Body() paymentData: { amount: number; currency: string; method: string },
    @AuthUser() user: User,
  ) {
    return this.billingService.createPayment(
      user.id,
      paymentData.amount,
      paymentData.currency,
      paymentData.method,
    );
  }
}
