import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from '../feed/feed.service';
import { UserDocument } from '../user/schemas/user.schema';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeDocument } from './schemas/recipe.schema';

describe('RecipeController', () => {
  let recipeController: RecipeController;
  let recipeService: RecipeService;
  let feedService: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: {
            generate: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: FeedService,
          useValue: {
            getTrending: jest.fn(),
          },
        },
      ],
    }).compile();

    recipeController = module.get<RecipeController>(RecipeController);
    recipeService = module.get<RecipeService>(RecipeService);
    feedService = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(recipeController).toBeDefined();
  });

  describe('generate', () => {
    it('should return a saved recipe given a prompt', async () => {
      const generateFunction = jest
        .spyOn(recipeService, 'generate')
        .mockResolvedValue({} as RecipeDocument);

      await recipeController.generate({ prompt: 'test-prompt' }, {
        id: '123',
      } as UserDocument);

      expect(generateFunction).toBeCalledWith(
        {
          prompt: 'test-prompt',
        },
        { id: '123' },
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const findAllFunction = jest
        .spyOn(recipeService, 'findAll')
        .mockResolvedValue([{} as RecipeDocument]);

      expect(
        await recipeController.findAll({ id: '123' } as UserDocument),
      ).toEqual([{}]);
      expect(findAllFunction).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return a recipe', async () => {
      const findOneFunction = jest
        .spyOn(recipeService, 'findOne')
        .mockResolvedValue({} as RecipeDocument);

      expect(await recipeController.findOne('123')).toEqual({});
      expect(findOneFunction).toBeCalledWith('123');
    });
  });

  describe('remove', () => {
    it('should remove a recipe', async () => {
      const removeFunction = jest
        .spyOn(recipeService, 'remove')
        .mockResolvedValue({} as RecipeDocument);

      expect(
        await recipeController.remove('123', { id: '123' } as UserDocument),
      ).toEqual({});
      expect(removeFunction).toBeCalledWith('123', { id: '123' });
    });
  });
});
