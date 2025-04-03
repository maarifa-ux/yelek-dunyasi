import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ description: 'Şehir adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Şehir kodu' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Bölge' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ description: 'Enlem', required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Boylam', required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Aktif mi?', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
