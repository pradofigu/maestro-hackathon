import { Test, TestingModule } from '@nestjs/testing';
import { ClockService } from './clockService';

describe('PointService', () => {
  let service: ClockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockService],
    }).compile();

    service = module.get<ClockService>(ClockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});