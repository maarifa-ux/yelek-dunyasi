import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getAppInfo() {
    const appName = this.configService.get('app.name');
    const appVersion = this.configService.get('app.version');

    return {
      name: appName || 'MotorClub Uygulaması',
      version: appVersion || '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
    };
  }
}
