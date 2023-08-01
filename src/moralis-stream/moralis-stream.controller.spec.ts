import { Test, TestingModule } from '@nestjs/testing';
import { MoralisStreamController } from './moralis-stream.controller';

describe('MoralisStreamController', () => {
  let controller: MoralisStreamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoralisStreamController],
    }).compile();

    controller = module.get<MoralisStreamController>(MoralisStreamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
