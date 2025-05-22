import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsEmail,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
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
  @IsUrl({}, { message: 'Logo için geçerli bir URL giriniz.' })
  logo?: string;

  @ApiPropertyOptional({ description: 'Kulüp kapak resmi URL' })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Kapak resmi için geçerli bir URL giriniz.' })
  cover?: string;

  @ApiPropertyOptional({
    description: 'Kulüp tipi',
    enum: ClubType,
    default: ClubType.PRIVATE,
  })
  @IsEnum(ClubType)
  @IsOptional()
  type?: ClubType;

  @ApiPropertyOptional({ description: 'Kulüp web sitesi' })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Geçerli bir web sitesi URLsi giriniz.' })
  website?: string;

  @ApiPropertyOptional({ description: 'Kulüp iletişim e-postası' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Kulüp adresi' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Kulüp resmi mi?',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    return value;
  })
  isOfficial?: boolean;
}
