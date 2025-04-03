import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { OneSignalService } from './services/onesignal.service';
import { MailjetService } from './services/mailjet.service';
import { NetGsmService } from './services/netgsm.service';
import { Notification } from './entities/notification.entity';
import { UserDevice } from './entities/user-device.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notification, UserDevice]),
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    OneSignalService,
    MailjetService,
    NetGsmService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
