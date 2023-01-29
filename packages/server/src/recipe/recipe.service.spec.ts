import { Test, TestingModule } from '@nestjs/testing';
import { GenerateService } from '../generate/generate.service';
import { MockModel } from '../utils/testing/mock.model';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: 'RecipeModel',
          useValue: MockModel,
        },
        {
          provide: GenerateService,
          useValue: {
            generateRecipe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
