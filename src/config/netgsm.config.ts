import { registerAs } from '@nestjs/config';

export const netGsmConfig = registerAs('netgsm', () => ({
  username: process.env.NETGSM_USERNAME,
  password: process.env.NETGSM_PASSWORD,
  header: process.env.NETGSM_HEADER || 'MOTORCLUB',
  apiUrl: 'https://api.netgsm.com.tr/sms/send/get',
}));
