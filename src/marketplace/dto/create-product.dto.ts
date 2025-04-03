import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsBoolean,
} from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ description: 'Ürün adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Ürün açıklaması' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Fiyat' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Stok miktarı' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ description: 'Ürün kategorisi ID' })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: 'Kulüp ID', required: false })
  @IsUUID()
  @IsOptional()
  clubId?: string;

  @ApiProperty({ description: "Ürün resim URL'leri", type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Ürün durumu',
    enum: ProductStatus,
    required: false,
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
