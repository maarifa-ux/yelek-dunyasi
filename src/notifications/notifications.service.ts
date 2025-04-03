import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDevice } from './entities/user-device.entity';
import { Notification, NotificationType } from './entities/notification.entity';
import { OneSignalService } from './services/onesignal.service';
import { MailjetService } from './services/mailjet.service';
import { NetGsmService } from './services/netgsm.service';
import { RecipientDto } from './dto/send-notification.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserDevice)
    private readonly userDeviceRepository: Repository<UserDevice>,
    private readonly oneSignalService: OneSignalService,
    private readonly mailjetService: MailjetService,
    private readonly netGsmService: NetGsmService,
    private readonly usersService: UsersService,
  ) {}

  async sendToRecipients(
    recipients: RecipientDto[],
    title: string,
    message: string,
    type: NotificationType = NotificationType.PUSH,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<boolean> {
    let success = true;

    for (const recipient of recipients) {
      // Kullanıcı ID'si verildi ise
      if (recipient.userId) {
        const user = await this.usersService.findById(recipient.userId);

        if (user) {
          if (type === NotificationType.PUSH || type === NotificationType.ALL) {
            const devices = await this.getUserDevices(user.id);
            const playerIds = devices.map((device) => device.token);

            if (playerIds.length) {
              const result = await this.oneSignalService.sendNotification(
                playerIds,
                title,
                message,
                data,
              );
              success = success && result;
            }
          }

          if (
            type === NotificationType.EMAIL ||
            type === NotificationType.ALL
          ) {
            if (user.email) {
              const result = await this.mailjetService.sendEmail(
                user.email,
                user.fullName,
                title,
                message,
              );
              success = success && result;
            }
          }

          if (type === NotificationType.SMS || type === NotificationType.ALL) {
            if (user.phone) {
              const result = await this.netGsmService.sendSms(
                user.phone,
                message,
              );
              success = success && result;
            }
          }

          // Bildirim kaydını oluştur
          await this.createNotificationRecord(
            user.id,
            title,
            message,
            type,
            data,
          );
        }
      }

      // Direkt player ID'leri verildi ise
      if (
        recipient.playerIds &&
        recipient.playerIds.length &&
        (type === NotificationType.PUSH || type === NotificationType.ALL)
      ) {
        const result = await this.oneSignalService.sendNotification(
          recipient.playerIds,
          title,
          message,
          data,
        );
        success = success && result;
      }

      // Direkt email verildi ise
      if (
        recipient.email &&
        (type === NotificationType.EMAIL || type === NotificationType.ALL)
      ) {
        const result = await this.mailjetService.sendEmail(
          recipient.email,
          '',
          title,
          message,
        );
        success = success && result;
      }

      // Direkt telefon verildi ise
      if (
        recipient.phone &&
        (type === NotificationType.SMS || type === NotificationType.ALL)
      ) {
        const result = await this.netGsmService.sendSms(
          recipient.phone,
          message,
        );
        success = success && result;
      }
    }

    return success;
  }

  // Kullanıcının cihazlarını kaydet/güncelle
  async subscribeDevice(userId: string, token: string): Promise<boolean> {
    // Aynı token ile kayıtlı cihaz var mı kontrol et
    const existingDevice = await this.userDeviceRepository.findOne({
      where: { token },
    });

    if (existingDevice) {
      // Farklı kullanıcıya ait ise güncelle
      if (existingDevice.userId !== userId) {
        existingDevice.userId = userId;
        await this.userDeviceRepository.save(existingDevice);
      }
    } else {
      // Yeni cihaz oluştur
      const device = this.userDeviceRepository.create({
        userId,
        token,
        isActive: true,
      });
      await this.userDeviceRepository.save(device);
    }

    return true;
  }

  // Kullanıcının cihazını kaldır
  async unsubscribeDevice(userId: string, token: string): Promise<boolean> {
    const device = await this.userDeviceRepository.findOne({
      where: { userId, token },
    });

    if (device) {
      await this.userDeviceRepository.remove(device);
    }

    return true;
  }

  // Kullanıcının cihazlarını getir
  async getUserDevices(userId: string): Promise<UserDevice[]> {
    return this.userDeviceRepository.find({
      where: { userId, isActive: true },
    });
  }

  // Bildirim kaydı oluştur
  private async createNotificationRecord(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<Notification> {
    const dataString = data ? JSON.stringify(data) : '';

    const notification = new Notification();
    notification.userId = userId;
    notification.title = title;
    notification.message = message;
    notification.type = type;
    notification.data = dataString;
    notification.isRead = false;

    return this.notificationRepository.save(notification);
  }

  // Diğer işlevsel bildirim metodları
  async sendNotificationToUser(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.PUSH,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<boolean> {
    try {
      const user = await this.usersService.findOne({ id: userId });
      if (!user) {
        return false;
      }

      let success = true;

      if (type === NotificationType.PUSH || type === NotificationType.ALL) {
        const devices = await this.getUserDevices(userId);
        const playerIds = devices.map((device) => device.token);

        if (playerIds.length) {
          const pushSuccess = await this.oneSignalService.sendNotification(
            playerIds,
            title,
            message,
            data,
          );
          success = success && pushSuccess;
        }
      }

      if (type === NotificationType.EMAIL || type === NotificationType.ALL) {
        if (user.email) {
          const emailSuccess = await this.mailjetService.sendEmail(
            user.email,
            user.fullName || user.nickname,
            title,
            message,
          );
          success = success && emailSuccess;
        }
      }

      if (type === NotificationType.SMS || type === NotificationType.ALL) {
        if (user.phone) {
          const smsSuccess = await this.netGsmService.sendSms(
            user.phone,
            message,
          );
          success = success && smsSuccess;
        }
      }

      // Bildirim kaydı oluştur
      await this.createNotificationRecord(userId, title, message, type, data);

      return success;
    } catch (error) {
      console.error('Send notification error:', error);
      return false;
    }
  }

  // SendNotificationBatch - Toplu bildirim gönderme
  async sendNotificationBatch(
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType = NotificationType.PUSH,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<boolean> {
    try {
      if (!userIds.length) {
        return false;
      }

      let success = true;

      if (type === NotificationType.PUSH || type === NotificationType.ALL) {
        // Tüm kullanıcıların cihazlarını topla
        const playerIdsSet = new Set<string>();

        for (const userId of userIds) {
          const devices = await this.getUserDevices(userId);
          devices.forEach((device) => playerIdsSet.add(device.token));
        }

        const playerIds = Array.from(playerIdsSet);

        if (playerIds.length) {
          const pushSuccess = await this.oneSignalService.sendNotification(
            playerIds,
            title,
            message,
            data,
          );
          success = success && pushSuccess;
        }
      }

      // E-posta ve SMS gönderimleri için kullanıcı bilgilerini topla
      if (
        type === NotificationType.EMAIL ||
        type === NotificationType.SMS ||
        type === NotificationType.ALL
      ) {
        const users = await this.usersService.findByIds(userIds);

        if (type === NotificationType.EMAIL || type === NotificationType.ALL) {
          const emails = users
            .filter((user) => user.email)
            .map((user) => ({
              email: user.email,
              name: user.fullName || user.nickname,
            }));

          if (emails.length) {
            const emailSuccess = await this.mailjetService.sendBulkEmail(
              emails,
              title,
              message,
              data ? JSON.stringify(data) : '',
            );
            success = success && emailSuccess;
          }
        }

        if (type === NotificationType.SMS || type === NotificationType.ALL) {
          const phones = users
            .filter((user) => user.phone)
            .map((user) => user.phone);

          if (phones.length) {
            const smsSuccess = await this.netGsmService.sendBulkSms(
              phones,
              message,
            );
            success = success && smsSuccess;
          }
        }
      }

      // Bildirim kayıtları oluştur
      for (const userId of userIds) {
        await this.createNotificationRecord(userId, title, message, type, data);
      }

      return success;
    } catch (error) {
      console.error('Send notification batch error:', error);
      return false;
    }
  }
}
