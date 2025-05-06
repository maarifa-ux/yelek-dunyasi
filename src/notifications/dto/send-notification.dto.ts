import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class RecipientDto {
  @ApiProperty({ description: 'Alıcı kullanıcı ID', required: false })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Alıcı e-posta', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Alıcı telefon', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: "Alıcı OneSignal player ID'leri",
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  playerIds?: string[];
}

export class SendNotificationDto {
  @ApiProperty({ description: 'Bildirim alıcıları', type: [RecipientDto] })
  @IsArray()
  @IsNotEmpty()
  recipients: RecipientDto[];

  @ApiProperty({ description: 'Bildirim başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Bildirim mesajı' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Bildirim tipi',
    enum: NotificationType,
    default: NotificationType.PUSH,
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiProperty({ description: 'Ek veriler', required: false })
  @IsObject()
  @IsOptional()
  data?: Record<string, string | number | boolean | object>;

  @ApiProperty({ description: 'Büyük ikon URL', required: false })
  @IsString()
  @IsOptional()
  largeIcon?: string;

  @ApiProperty({ description: 'Büyük resim URL', required: false })
  @IsString()
  @IsOptional()
  bigPicture?: string;
}
