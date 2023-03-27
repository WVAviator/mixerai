import { RecipeDocument } from './../../dist/recipe/schemas/recipe.schema.d';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserLoginEvent } from '../auth/events/user-login.event';
import { UserCreatedEvent } from '../user/events/user-created.event';
import { UserDocument } from '../user/schemas/user.schema';
import { MockModel } from '../utils/testing/mock.model';
import { TokenCount, TokenCountDocument } from './schemas/token-count.schema';
import { TokensService } from './tokens.service';
import { RecipeCreatedEvent } from '../recipe/events/recipe-created.event';

describe('TokensService', () => {
  let tokensService: TokensService;
  let mockTokenCountModel: Model<TokenCountDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(TokenCount.name), useValue: MockModel },
        TokensService,
      ],
    }).compile();

    tokensService = module.get<TokensService>(TokensService);
    mockTokenCountModel = module.get<Model<TokenCountDocument>>(
      getModelToken(TokenCount.name),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
  });

  describe('handleUserCreatedEvent', () => {
    it('should create a token count for a new user', async () => {
      await tokensService.handleUserCreatedEvent(
        new UserCreatedEvent({ id: '123' } as UserDocument),
      );

      expect(mockTokenCountModel.create).toHaveBeenCalledWith({
        userId: '123',
        tokens: 3,
      });
    });
  });

  describe('handleUserLoginEvent', () => {
    it('should do nothing if a count already exists', async () => {
      jest
        .spyOn(mockTokenCountModel, 'findOne')
        .mockResolvedValue({ userId: '123', tokens: 4 });

      await tokensService.handleUserLoginEvent(
        new UserLoginEvent({ id: '123' } as UserDocument),
      );

      expect(mockTokenCountModel.create).not.toHaveBeenCalled();
    });

    it('should create a token count for a user without one', async () => {
      jest.spyOn(mockTokenCountModel, 'findOne').mockResolvedValue(null);

      await tokensService.handleUserLoginEvent(
        new UserLoginEvent({ id: '123' } as UserDocument),
      );

      expect(mockTokenCountModel.create).toHaveBeenCalledWith({
        userId: '123',
        tokens: 3,
      });
    });
  });

  describe('getTokenCount', () => {
    it('should return the token count', async () => {
      const findOneFunction = jest
        .spyOn(mockTokenCountModel, 'findOne')
        .mockResolvedValue({ tokens: 4 });

      const tokenCount = await tokensService.getTokenCount('123');

      expect(tokenCount).toEqual(4);
      expect(findOneFunction).toHaveBeenCalledWith({ userId: '123' });
    });
  });

  describe('increaseTokenCount', () => {
    it('should increase the token count', async () => {
      const findOneAndUpdateFunction = jest
        .spyOn(mockTokenCountModel, 'findOneAndUpdate')
        .mockResolvedValue({ tokens: 10 });

      const tokenCount = await tokensService.increaseTokenCount('123', 10);

      expect(tokenCount).toEqual(10);
      expect(findOneAndUpdateFunction).toBeCalledWith(
        { userId: '123' },
        { $inc: { tokens: 10 } },
        { new: true },
      );
    });
  });

  describe('handleRecipeCreatedEvent', () => {
    it('should decrement the token count by one when a recipe is created', async () => {
      jest.spyOn(mockTokenCountModel, 'findOneAndUpdate').mockResolvedValue({
        tokens: 10,
      });

      await tokensService.handleRecipeCreatedEvent(
        new RecipeCreatedEvent(
          { id: '456' } as RecipeDocument,
          { id: '123' } as UserDocument,
        ),
      );

      expect(mockTokenCountModel.findOneAndUpdate).toBeCalledWith(
        { userId: '123' },
        { $inc: { tokens: -1 } },
        { new: true },
      );
    });
  });
});
