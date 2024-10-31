import { Test, TestingModule } from '@nestjs/testing';
import { SubCatagoriesService } from './sub_catagories.service';

describe('SubCatagoriesService', () => {
  let service: SubCatagoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCatagoriesService],
    }).compile();

    service = module.get<SubCatagoriesService>(SubCatagoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
