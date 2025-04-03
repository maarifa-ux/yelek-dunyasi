import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
