import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class AddCityDto {
  @ApiProperty({ description: 'Şehir adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Şehir kimliği', required: false })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiProperty({ description: 'Şehir kodu', required: false })
  @IsString()
  @IsOptional()
  code?: string;
}
