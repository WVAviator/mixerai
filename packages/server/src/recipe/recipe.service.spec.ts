import { InternalServerErrorException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { GeneratedRecipe } from '../generate/dtos/generated-recipe.dto';
import { GenerateService } from '../generate/generate.service';
import { ImageService } from '../image/image.service';
import { User } from '../user/schemas/user.schema';
import { MockModel } from '../utils/testing/mock.model';
import { RecipeService } from './recipe.service';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let generateService: GenerateService;
  let imageService: ImageService;
  let mockRecipeModel: Model<RecipeDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getModelToken(Recipe.name),
          useValue: MockModel,
        },
        {
          provide: GenerateService,
          useValue: {
            generateRecipe: jest.fn(),
          },
        },
        {
          provide: ImageService,
          useValue: {
            generateImage: jest.fn(),
          },
        },
      ],
    }).compile();

    recipeService = module.get<RecipeService>(RecipeService);
    generateService = module.get<GenerateService>(GenerateService);
    imageService = module.get<ImageService>(ImageService);
    mockRecipeModel = module.get<Model<RecipeDocument>>(
      getModelToken(Recipe.name),
    );
  });

  it('should be defined', () => {
    expect(recipeService).toBeDefined();
  });

  describe('generate', () => {
    it('should return a saved recipe given a prompt', async () => {
      const generateRecipeFunction = jest
        .spyOn(generateService, 'generateRecipe')
        .mockResolvedValue({
          imagePrompt: 'Test image prompt',
        } as GeneratedRecipe);
      const generateImageFunction = jest
        .spyOn(imageService, 'generateImage')
        .mockResolvedValue('test-image-url');
      const createFunction = jest.spyOn(mockRecipeModel, 'create');

      await recipeService.generate({ prompt: 'test-prompt' }, {} as User);

      expect(generateRecipeFunction).toBeCalled();
      expect(generateImageFunction).toBeCalled();
      expect(createFunction).toBeCalled();
    });

    it('should throw an error if the database fails to create', async () => {
      jest.spyOn(generateService, 'generateRecipe').mockResolvedValue({
        imagePrompt: 'Test image prompt',
      } as GeneratedRecipe);
      jest
        .spyOn(imageService, 'generateImage')
        .mockResolvedValue('test-image-url');
      jest.spyOn(mockRecipeModel, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(
        recipeService.generate({ prompt: 'test-prompt' }, {} as User),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
