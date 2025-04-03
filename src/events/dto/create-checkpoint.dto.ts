import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CheckpointType } from '../entities/event-checkpoint.entity';

export class CreateCheckpointDto {
  @ApiProperty({ description: 'Kontrol noktası adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Kontrol noktası tipi', enum: CheckpointType })
  @IsEnum(CheckpointType)
  @IsNotEmpty()
  type: CheckpointType;

  @ApiProperty({ description: 'Sıra numarası' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  orderIndex: number;

  @ApiProperty({ description: 'Adres' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Enlem' })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Boylam' })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Tahmini varış saati', required: false })
  @IsString()
  @IsOptional()
  estimatedArrivalTime?: string;

  @ApiProperty({ description: 'Tahmini ayrılış saati', required: false })
  @IsString()
  @IsOptional()
  estimatedDepartureTime?: string;

  @ApiProperty({ description: 'Önceki noktadan mesafe (km)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  distanceFromPrevious?: number;
}
