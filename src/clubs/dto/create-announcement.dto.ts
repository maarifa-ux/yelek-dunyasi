import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Duyuru başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Duyuru içeriği' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Duyuru önceliği' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Duyuru son geçerlilik tarihi' })
  @IsOptional()
  @IsDate()
  expiryDate?: Date;
}
