import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../../../products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class productsSeedService {
  constructor(
    @InjectRepository(Products)
    private repository: Repository<Products>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0 || count < 5) {
      await this.repository.save(
        this.repository.create({
          productCardId: '2e63341a-e627-48ac-bb1a-9d56e2e9cc4f',
          categoryId: '2e63341a-e627-48ac-bb1a-9d56e2e9cc4f',
          imgUrl: 'http://google.com',
          barcode: '35000350001',
          productName: 'Stok Adı',
          brand: 'Stok Marka',
          count: 10,
          buyPrice: 1000,
          quantityPrice: 10,
          sellPrice: 15,
          taxRate: 20,
          ratedPrice: 18,
          unitBuyType: "24'lü Karton",
          unitType: "24'lü Karton",
          showOnSellScreen: true,
        }),
      );
    }
  }
}
