import { PartialType } from '@nestjs/swagger';
import { CreateClubDto } from './create-club.dto';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClubStatus, ClubType } from '../entities/club.entity';

export class UpdateClubDto extends PartialType(CreateClubDto) {
  @ApiProperty({
    description: 'Kulüp durumu',
    enum: ClubStatus,
    required: false,
  })
  @IsEnum(ClubStatus)
  @IsOptional()
  status?: ClubStatus;

  @ApiProperty({ description: 'Aktif mi?', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Kulüp adı' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Kulüp açıklaması' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Kulüp logosu URL' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ description: 'Kulüp kapak resmi URL' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({ description: 'Kulüp tipi', enum: ClubType })
  @IsEnum(ClubType)
  @IsOptional()
  type?: ClubType;
}
