import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OneSignalService {
  private readonly appId: string;
  private readonly restApiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.appId = this.configService.getOrThrow('oneSignal.appId', {
      infer: true,
    });
    this.restApiKey = this.configService.getOrThrow('oneSignal.restApiKey', {
      infer: true,
    });
    this.apiUrl = this.configService.getOrThrow('oneSignal.apiUrl', {
      infer: true,
    });
  }

  async sendNotification(
    playerIds: string[],
    title: string,
    message: string,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<boolean> {
    if (!playerIds.length) {
      return false;
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/notifications`,
        {
          app_id: this.appId,
          include_player_ids: playerIds,
          headings: { tr: title, en: title },
          contents: { tr: message, en: message },
          data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.restApiKey}`,
          },
        },
      );

      return response.status === 200;
    } catch (error) {
      console.error('OneSignal bildirim gönderirken hata oluştu:', error);
      return false;
    }
  }

  async sendToSegment(
    segment: string,
    title: string,
    message: string,
    data?: Record<string, string | number | boolean | object>,
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: this.appId,
          included_segments: [segment],
          headings: { en: title, tr: title },
          contents: { en: message, tr: message },
          data: data || {},
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.restApiKey}`,
          },
        },
      );

      return response.status === 200;
    } catch (error) {
      console.error('OneSignal segment notification error:', error);
      return false;
    }
  }
}
