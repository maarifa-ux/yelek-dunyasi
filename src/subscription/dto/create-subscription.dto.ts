import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Kulüp ID' })
  @IsUUID()
  @IsNotEmpty()
  clubId: string;

  @ApiProperty({ description: 'Abonelik planı', enum: ['monthly', 'yearly'] })
  @IsEnum(['monthly', 'yearly'])
  @IsNotEmpty()
  plan: 'monthly' | 'yearly';

  @ApiProperty({ description: 'Abonelik tutarı' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Başlangıç tarihi' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Bitiş tarihi' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Ödeme yöntemi' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ description: 'İzin verilen üye sayısı', required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  allowedMemberCount?: number;

  @ApiProperty({ description: 'Otomatik yenileme', required: false })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;
}
