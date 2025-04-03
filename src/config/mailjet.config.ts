import { registerAs } from '@nestjs/config';

export const mailjetConfig = registerAs('mailjet', () => ({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
  fromEmail: process.env.MAILJET_FROM_EMAIL || 'info@motorcluapp.com',
  fromName: process.env.MAILJET_FROM_NAME || 'MotorClub Uygulaması',
}));
