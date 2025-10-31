import { Test, TestingModule } from '@nestjs/testing';
import { SoldesService } from './soldes.service';

describe('SoldesService', () => {
  let service: SoldesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoldesService],
    }).compile();

    service = module.get<SoldesService>(SoldesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
