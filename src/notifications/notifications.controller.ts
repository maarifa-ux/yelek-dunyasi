import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Bildirimler')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bildirim gönder' })
  send(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.sendToRecipients(
      sendNotificationDto.recipients,
      sendNotificationDto.title,
      sendNotificationDto.message,
      sendNotificationDto.type,
      sendNotificationDto.data,
      sendNotificationDto.largeIcon,
      sendNotificationDto.bigPicture,
    );
  }

  @Post('subscribe/:token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bildirimler için aygıt ekle' })
  subscribe(@Param('token') token: string, @AuthUser() user: User) {
    return this.notificationsService.subscribeDevice(user.id, token);
  }

  @Post('unsubscribe/:token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bildirimler için aygıt kaldır' })
  unsubscribe(@Param('token') token: string, @AuthUser() user: User) {
    return this.notificationsService.unsubscribeDevice(user.id, token);
  }
}
