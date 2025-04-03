import { Test, TestingModule } from '@nestjs/testing';
import { AppManagementController } from './app-management.controller';

describe('AppManagementController', () => {
  let controller: AppManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppManagementController],
    }).compile();

    controller = module.get<AppManagementController>(AppManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
