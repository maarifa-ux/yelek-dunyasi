import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productCardId: string;

  @Column()
  categoryId: string;

  @Column()
  imgUrl: string;

  @Column()
  barcode: string;

  @Column()
  productName: string;

  @Column()
  brand: string;

  @Column()
  count: number;

  @Column()
  buyPrice: number;

  @Column()
  quantityPrice: number;

  @Column()
  sellPrice: number;

  @Column()
  taxRate: number;

  @Column()
  ratedPrice: number;

  @Column()
  unitBuyType: string;

  @Column()
  unitType: string;

  @Column()
  showOnSellScreen: boolean;
}
