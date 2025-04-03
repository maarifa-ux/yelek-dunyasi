import { registerAs } from '@nestjs/config';

export const oneSignalConfig = registerAs('oneSignal', () => ({
  appId: process.env.ONESIGNAL_APP_ID,
  restApiKey: process.env.ONESIGNAL_REST_API_KEY,
  apiUrl: 'https://onesignal.com/api/v1',
}));
