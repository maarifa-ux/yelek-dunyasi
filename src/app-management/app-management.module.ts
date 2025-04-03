import { Module } from '@nestjs/common';
import { AppManagementService } from './app-management.service';
import { AppManagementController } from './app-management.controller';

@Module({
  providers: [AppManagementService],
  controllers: [AppManagementController],
})
export class AppManagementModule {}
