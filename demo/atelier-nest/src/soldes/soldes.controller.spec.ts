import { Test, TestingModule } from '@nestjs/testing';
import { SoldesController } from './soldes.controller';

describe('SoldesController', () => {
  let controller: SoldesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoldesController],
    }).compile();

    controller = module.get<SoldesController>(SoldesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
