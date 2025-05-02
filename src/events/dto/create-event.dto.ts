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
  IsBoolean,
} from 'class-validator';
import { EventScope, EventType, TargetRank } from '../entities/event.entity';

export class WaypointDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}

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
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ description: 'Boylam' })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'Hedef rütbeler',
    enum: TargetRank,
    isArray: true,
  })
  @IsArray()
  @IsEnum(TargetRank, { each: true })
  @IsOptional()
  targetRanks?: TargetRank[];

  @ApiProperty({ description: 'Hedef konumu' })
  @IsString()
  @IsNotEmpty()
  destinationLocationName: string;

  @ApiProperty({ description: 'Hedef konumunun enlemi' })
  @IsNumber()
  @IsNotEmpty()
  destinationLatitude: number;

  @ApiProperty({ description: 'Hedef konumunun boylamı' })
  @IsNumber()
  @IsNotEmpty()
  destinationLongitude: number;

  @ApiProperty({ description: 'Yol noktaları', type: [WaypointDto] })
  @IsArray()
  @IsOptional()
  waypoints?: WaypointDto[];

  @ApiProperty({ description: 'Maksimum katılımcı sayısı' })
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ description: 'Özel mi?' })
  @IsBoolean()
  @IsNotEmpty()
  isPrivate: boolean;

  @ApiProperty({ description: 'Etiketler', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Mesafe' })
  @IsNumber()
  @IsNotEmpty()
  distance: number;

  @ApiProperty({ description: 'Yol linki', required: false })
  @IsString()
  @IsOptional()
  travelLink?: string;
}
