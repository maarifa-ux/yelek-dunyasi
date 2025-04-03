import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsSeedService } from './products-seed.service';
import { Products } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  providers: [productsSeedService],
  exports: [productsSeedService],
})
export class productsSeedModule {}
