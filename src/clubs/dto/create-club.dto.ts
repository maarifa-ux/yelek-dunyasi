import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ClubType } from '../entities/club.entity';

export class CreateClubDto {
  @ApiProperty({ description: 'Kulüp adı' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Kulüp açıklaması' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Kulüp logosu URL' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ description: 'Kulüp kapak resmi URL' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiPropertyOptional({
    description: 'Kulüp tipi',
    enum: ClubType,
    default: ClubType.PRIVATE,
  })
  @IsEnum(ClubType)
  @IsOptional()
  type?: ClubType;
}
