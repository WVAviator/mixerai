import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
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
            deleteImage: jest.fn(),
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
      ).rejects.toThrow(DatabaseException);
    });
  });

  describe('findAll', () => {
    it('should return all recipes for a user', async () => {
      const findFunction = jest.spyOn(mockRecipeModel, 'find');

      await recipeService.findAll({ id: '123' } as User);

      expect(findFunction).toBeCalledWith({ user: '123' });
    });

    it('should throw an error if the database fails to find', async () => {
      jest.spyOn(mockRecipeModel, 'find').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(recipeService.findAll({} as User)).rejects.toThrow(
        DatabaseException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a recipe by id', async () => {
      const findByIdFunction = jest.spyOn(mockRecipeModel, 'findOne');

      await recipeService.findOne('123');

      expect(findByIdFunction).toBeCalledWith({ _id: '123' });
    });

    it('should throw an error if the database fails to find', async () => {
      jest.spyOn(mockRecipeModel, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(recipeService.findOne('123')).rejects.toThrow(
        DatabaseException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a recipe by id', async () => {
      const mockUser = { id: 'abc' } as unknown as User;
      const mockRecipe = {
        remove: jest.fn(),
        user: mockUser,
      } as unknown as RecipeDocument;
      const findFunction = jest
        .spyOn(mockRecipeModel, 'findOne')
        .mockResolvedValue(mockRecipe);

      await recipeService.remove('123', mockUser);

      expect(findFunction).toBeCalledWith({ _id: '123' });
      expect(mockRecipe.remove).toBeCalled();
    });

    it('should throw an error if the database fails to find', async () => {
      jest.spyOn(mockRecipeModel, 'findOne').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(recipeService.remove('123', {} as User)).rejects.toThrow(
        DatabaseException,
      );
    });

    it('should throw an error if the recipe does not belong to the user', async () => {
      const mockUser = { id: 'abc' } as unknown as User;
      const mockRecipe = {
        remove: jest.fn(),
        user: { id: 'def' },
      } as unknown as RecipeDocument;
      jest.spyOn(mockRecipeModel, 'findOne').mockResolvedValue(mockRecipe);

      await expect(recipeService.remove('123', mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw an error if the database fails to remove', async () => {
      const mockUser = { id: 'abc' } as unknown as User;
      const mockRecipe = {
        remove: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
        user: mockUser,
      } as unknown as RecipeDocument;
      jest.spyOn(mockRecipeModel, 'findOne').mockResolvedValue(mockRecipe);

      await expect(recipeService.remove('123', mockUser)).rejects.toThrow(
        DatabaseException,
      );
    });

    it('should request to delete the image in s3', async () => {
      const mockUser = { id: 'abc' } as unknown as User;
      const mockRecipe = {
        remove: jest.fn(),
        user: mockUser,
        imageUrl: 'test-image-url',
      } as unknown as RecipeDocument;
      jest.spyOn(mockRecipeModel, 'findOne').mockResolvedValue(mockRecipe);
      const deleteImageFunction = jest.spyOn(imageService, 'deleteImage');

      await recipeService.remove('123', mockUser);

      expect(deleteImageFunction).toBeCalledWith('test-image-url');
    });
  });
});
