import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NetGsmService {
  private readonly username: string;
  private readonly password: string;
  private readonly header: string;

  constructor(private readonly configService: ConfigService) {
    this.username = this.configService.getOrThrow('netgsm.username', {
      infer: true,
    });
    this.password = this.configService.getOrThrow('netgsm.password', {
      infer: true,
    });
    this.header = this.configService.getOrThrow('netgsm.header', {
      infer: true,
    });
  }

  async sendSms(phoneNumber: string, message: string): Promise<boolean> {
    try {
      // Format phone number (remove country code if needed)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const params = new URLSearchParams();
      params.append('usercode', this.username);
      params.append('password', this.password);
      params.append('gsmno', formattedPhone);
      params.append('message', message);
      params.append('msgheader', this.header);

      const response = await axios.post(
        'https://api.netgsm.com.tr/sms/send/xml',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // NetGSM response needs to be parsed
      return response.data.includes('<code>00</code>');
    } catch (error) {
      console.error('NetGSM SMS error:', error);
      return false;
    }
  }

  async sendBulkSms(phoneNumbers: string[], message: string): Promise<boolean> {
    try {
      // Format phone numbers
      const formattedPhones = phoneNumbers
        .map((phone) => this.formatPhoneNumber(phone))
        .join(',');

      const params = new URLSearchParams();
      params.append('usercode', this.username);
      params.append('password', this.password);
      params.append('gsmno', formattedPhones);
      params.append('message', message);
      params.append('msgheader', this.header);

      const response = await axios.post(
        'https://api.netgsm.com.tr/sms/send/xml',
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // NetGSM response needs to be parsed
      return response.data.includes('<code>00</code>');
    } catch (error) {
      console.error('NetGSM bulk SMS error:', error);
      return false;
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Remove country code if it exists (e.g., 90 for Turkey)
    if (cleaned.startsWith('90') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    }

    return cleaned;
  }
}
