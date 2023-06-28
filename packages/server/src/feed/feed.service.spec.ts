import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../recipe/schemas/recipe.schema';
import { MockModel } from '../utils/testing/mock.model';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;
  let mockRecipeModel: Model<RecipeDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: getModelToken(Recipe.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    mockRecipeModel = module.get<Model<RecipeDocument>>(
      getModelToken(Recipe.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
