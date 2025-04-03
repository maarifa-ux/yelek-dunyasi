import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { images, ...productData } = createProductDto;
    const product = this.productRepository.create({
      ...productData,
      createdBy: user,
      createdById: user.id,
    });

    const savedProduct = await this.productRepository.save(product);

    if (images) {
      const productImages = images.map((url) =>
        this.productImageRepository.create({
          url,
          product: savedProduct,
          productId: savedProduct.id,
        }),
      );
      await this.productImageRepository.save(productImages);
    }

    return savedProduct;
  }

  async findAllProducts(
    clubId?: string,
    categoryId?: string,
    search?: string,
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.createdBy', 'createdBy')
      .leftJoinAndSelect('product.images', 'images');

    if (clubId) {
      query.andWhere('createdBy.clubId = :clubId', { clubId });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
  }

  async findOneProduct(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'createdBy', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.findOneProduct(id);

    if (product.createdById !== user.id) {
      throw new BadRequestException('You can only update your own products');
    }

    const { images, ...productData } = updateProductDto;
    Object.assign(product, productData);

    if (images) {
      const productImages = images.map((url) =>
        this.productImageRepository.create({
          url,
          product: product,
          productId: product.id,
        }),
      );
      await this.productImageRepository.save(productImages);
    }

    return this.productRepository.save(product);
  }

  async removeProduct(id: string, user: User): Promise<void> {
    const product = await this.findOneProduct(id);

    if (product.createdById !== user.id) {
      throw new BadRequestException('You can only delete your own products');
    }

    await this.productRepository.remove(product);
  }

  async createCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = this.categoryRepository.create(createProductCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<ProductCategory[]> {
    return this.categoryRepository.find();
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      orderNumber: `ORD-${Date.now()}`,
      user: user,
      userId: user.id,
      status: OrderStatus.PENDING,
      shippingAddress: createOrderDto.shippingAddress,
      paymentMethod: createOrderDto.paymentMethod,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = createOrderDto.items.map((item) =>
      this.orderItemRepository.create({
        order: savedOrder,
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    return savedOrder;
  }

  async findAllOrders(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: [
        { userId: user.id },
        { orderItems: { product: { createdById: user.id } } },
      ],
      relations: [
        'orderItems',
        'orderItems.product',
        'user',
        'orderItems.product.createdBy',
      ],
    });
  }

  async findOneOrder(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: [
        'orderItems',
        'orderItems.product',
        'user',
        'orderItems.product.createdBy',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.userId !== user.id &&
      order.orderItems.some((item) => item.product.createdById !== user.id)
    ) {
      throw new BadRequestException('You can only view your own orders');
    }

    return order;
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: User,
  ): Promise<Order> {
    const order = await this.findOneOrder(id, user);

    if (order.orderItems.some((item) => item.product.createdById !== user.id)) {
      throw new BadRequestException(
        'Only the seller can update the order status',
      );
    }

    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }
}
