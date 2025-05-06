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
    this.apiUrl =
      this.configService.getOrThrow('oneSignal.apiUrl', {
        infer: true,
      }) || 'https://onesignal.com/api/v1/notifications';
  }

  async sendNotification(
    playerIds: string[],
    title: string,
    message: string,
    data?: Record<string, string | number | boolean | object>,
    largeIcon?: string,
    bigPicture?: string,
  ): Promise<boolean> {
    if (!playerIds || playerIds.length === 0) {
      console.warn(
        'OneSignal playerIds boş olduğu için bildirim gönderilmedi.',
      );
      return false;
    }

    interface OneSignalFilter {
      field?: 'tag';
      key?: string;
      relation?: string;
      value?: string;
      operator?: 'OR';
    }

    const requestBody: {
      app_id: string;
      filters: OneSignalFilter[];
      headings: { [key: string]: string };
      contents: { [key: string]: string };
      data: Record<string, string | number | boolean | object>;
      large_icon?: string;
      big_picture?: string;
    } = {
      app_id: this.appId,
      filters: [],
      headings: { tr: title, en: title },
      contents: { tr: message, en: message },
      data: data || {},
    };

    const filters: OneSignalFilter[] = [];
    playerIds.forEach((id, index) => {
      if (index > 0) {
        filters.push({ operator: 'OR' });
      }
      filters.push({ field: 'tag', key: 'deviceId', relation: '=', value: id });
    });
    requestBody.filters = filters;

    if (largeIcon) {
      requestBody.large_icon = largeIcon;
    }
    if (bigPicture) {
      requestBody.big_picture = bigPicture;
    }

    try {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        requestBody,
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
