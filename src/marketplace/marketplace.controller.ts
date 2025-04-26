import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarketplaceService } from './marketplace.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Pazar Yeri')
@Controller({
  path: 'marketplace',
  version: '1',
})
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Ürünler
  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni ürün ekle' })
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @AuthUser() user: User,
  ) {
    return this.marketplaceService.createProduct(createProductDto, user);
  }

  @Get('products')
  @ApiOperation({ summary: 'Ürünleri listele' })
  findAllProducts(
    @Query('clubId') clubId: string,
    @Query('categoryId') categoryId: string,
    @Query('search') search: string,
  ) {
    return this.marketplaceService.findAllProducts(clubId, categoryId, search);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Ürün detaylarını getir' })
  findOneProduct(@Param('id') id: string) {
    return this.marketplaceService.findOneProduct(id);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün bilgilerini güncelle' })
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @AuthUser() user: User,
  ) {
    return this.marketplaceService.updateProduct(id, updateProductDto, user);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün sil' })
  removeProduct(@Param('id') id: string, @AuthUser() user: User) {
    return this.marketplaceService.removeProduct(id, user);
  }

  // Kategoriler
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kategori ekle' })
  createCategory(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.marketplaceService.createCategory(createProductCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Kategorileri listele' })
  findAllCategories() {
    return this.marketplaceService.findAllCategories();
  }

  // Siparişler
  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni sipariş oluştur' })
  createOrder(@Body() createOrderDto: CreateOrderDto, @AuthUser() user: User) {
    return this.marketplaceService.createOrder(createOrderDto, user);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Siparişleri listele' })
  findAllOrders(@AuthUser() user: User) {
    return this.marketplaceService.findAllOrders(user);
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sipariş detaylarını getir' })
  findOneOrder(@Param('id') id: string, @AuthUser() user: User) {
    return this.marketplaceService.findOneOrder(id, user);
  }

  @Patch('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sipariş durumunu güncelle' })
  updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @AuthUser() user: User,
  ) {
    return this.marketplaceService.updateOrder(id, updateOrderDto, user);
  }
}
