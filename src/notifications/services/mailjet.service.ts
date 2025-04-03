import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailjet from 'node-mailjet';

interface MailjetResponse {
  body: {
    Messages: Array<{
      Status: string;
    }>;
  };
}

@Injectable()
export class MailjetService {
  private readonly mailjet: Mailjet;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow('mailjet.apiKey', {
      infer: true,
    });
    const apiSecret = this.configService.getOrThrow('mailjet.apiSecret', {
      infer: true,
    });

    this.fromEmail = this.configService.getOrThrow('mailjet.fromEmail', {
      infer: true,
    });
    this.fromName = this.configService.getOrThrow('mailjet.fromName', {
      infer: true,
    });

    this.mailjet = Mailjet.apiConnect(apiKey, apiSecret);
  }

  async sendEmail(
    to: string,
    subject: string,
    textContent: string,
    htmlContent: string,
  ): Promise<boolean> {
    try {
      const request = this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: this.fromEmail,
              Name: this.fromName,
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: subject,
            TextPart: textContent,
            HTMLPart: htmlContent,
          },
        ],
      });

      const response = (await request) as unknown as MailjetResponse;
      return response.body.Messages[0].Status === 'success';
    } catch (error) {
      console.error('Mailjet error:', error);
      return false;
    }
  }

  async sendBulkEmail(
    recipients: Array<{ email: string; name?: string }>,
    subject: string,
    textContent: string,
    htmlContent: string,
  ): Promise<boolean> {
    try {
      const messages = recipients.map((recipient) => ({
        From: {
          Email: this.fromEmail,
          Name: this.fromName,
        },
        To: [
          {
            Email: recipient.email,
            Name: recipient.name || '',
          },
        ],
        Subject: subject,
        TextPart: textContent,
        HTMLPart: htmlContent,
      }));

      const request = this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: messages,
      });

      const response = (await request) as unknown as MailjetResponse;
      return response.body.Messages.every(
        (message) => message.Status === 'success',
      );
    } catch (error) {
      console.error('Mailjet bulk email error:', error);
      return false;
    }
  }
}
