import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class AuthUpdateDto {
  @ApiPropertyOptional({ example: 'Doğukan' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Canerler' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'doğucan' })
  @IsOptional()
  @IsString()
  nickname?: string | null;

  @ApiPropertyOptional({ example: '5551234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'İzmir' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Karşıyaka' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  driverLicenseType?: string;

  @ApiPropertyOptional({ example: 'L' })
  @IsOptional()
  @IsString()
  clothingSize?: string;

  @ApiPropertyOptional({ example: 'UNKNOWN' })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiPropertyOptional({ example: 'Honda' })
  @IsOptional()
  @IsString()
  motorcycleBrand?: string;

  @ApiPropertyOptional({ example: 'CBR650R' })
  @IsOptional()
  @IsString()
  motorcycleModel?: string;

  @ApiPropertyOptional({ example: 650 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  motorcycleCc?: number;

  @ApiPropertyOptional({ example: 'Acil durumda aranacak kişi adı' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: 'Arkadaş' })
  @IsOptional()
  @IsString()
  emergencyContactRelation?: string;

  @ApiPropertyOptional({ example: '5557654321' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ example: 'onesignal-player-id-string' })
  @IsOptional()
  @IsString()
  oneSignalPlayerId?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string | null;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Doğum tarihi ISO 8601 formatında (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @ApiPropertyOptional({ example: 'Yazılımcı' })
  @IsOptional()
  @IsString()
  profession?: string | null;
}
