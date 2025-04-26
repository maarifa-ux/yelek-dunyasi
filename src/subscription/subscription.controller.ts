import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Abonelikler')
@Controller({
  path: 'subscriptions',
  version: '1',
})
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni abonelik oluştur' })
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @AuthUser() user: User,
  ) {
    return this.subscriptionService.create(createSubscriptionDto, user);
  }

  @Get('club/:clubId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kulüp aboneliğini getir' })
  findByClub(@Param('clubId') clubId: string, @AuthUser() user: User) {
    return this.subscriptionService.findByClub(clubId, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abonelik bilgilerini güncelle' })
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @AuthUser() user: User,
  ) {
    return this.subscriptionService.update(id, updateSubscriptionDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aboneliği iptal et' })
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.subscriptionService.remove(id, user);
  }
}
