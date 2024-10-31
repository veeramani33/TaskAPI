import { Test, TestingModule } from '@nestjs/testing';
import { SubCatagoriesController } from './sub_catagories.controller';
import { SubCatagoriesService } from './sub_catagories.service';

describe('SubCatagoriesController', () => {
  let controller: SubCatagoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCatagoriesController],
      providers: [SubCatagoriesService],
    }).compile();

    controller = module.get<SubCatagoriesController>(SubCatagoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
