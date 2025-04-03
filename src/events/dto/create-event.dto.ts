import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsArray,
  Min,
  IsBoolean,
} from 'class-validator';
import { EventScope, EventType } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ description: 'Etkinlik başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Etkinlik açıklaması' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Etkinlik tipi', enum: EventType })
  @IsEnum(EventType)
  @IsNotEmpty()
  type: EventType;

  @ApiProperty({ description: 'Etkinlik kapsamı', enum: EventScope })
  @IsEnum(EventScope)
  @IsNotEmpty()
  scope: EventScope;

  @ApiProperty({ description: 'Kulüp ID' })
  @IsUUID()
  @IsNotEmpty()
  clubId: string;

  @ApiProperty({ description: 'Kulüp Şehir ID', required: false })
  @IsUUID()
  @IsOptional()
  clubCityId?: string;

  @ApiProperty({ description: 'Başlangıç tarihi ve saati' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Bitiş tarihi ve saati' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: 'Lokasyon adı' })
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @ApiProperty({ description: 'Enlem' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Boylam' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Kapasiteye göre sınırlı mı?' })
  @IsBoolean()
  @IsOptional()
  isLimitedByCapacity?: boolean;

  @ApiProperty({ description: 'Katılımcı kapasitesi' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'Hedef rütbeler',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  targetRanks?: string[];
}
