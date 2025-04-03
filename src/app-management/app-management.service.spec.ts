import { Test, TestingModule } from '@nestjs/testing';
import { AppManagementService } from './app-management.service';

describe('AppManagementService', () => {
  let service: AppManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppManagementService],
    }).compile();

    service = module.get<AppManagementService>(AppManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
