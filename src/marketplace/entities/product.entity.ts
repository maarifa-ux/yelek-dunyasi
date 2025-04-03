import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Club } from '../../clubs/entities/club.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SOLD_OUT = 'sold_out',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Club, (club) => club.products)
  @JoinColumn()
  club: Club;

  @Column()
  clubId: string;

  @ManyToOne(() => User, (user) => user.createdProducts)
  @JoinColumn()
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => ProductCategory)
  @JoinColumn()
  category: ProductCategory;

  @Column()
  categoryId: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  orderCount: number;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
