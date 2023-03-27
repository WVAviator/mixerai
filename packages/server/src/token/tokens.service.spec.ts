import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { MockModel } from '../utils/testing/mock.model';
import { TokenCount, TokenCountDocument } from './schemas/token-count.schema';
import { TokensService } from './tokens.service';

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

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
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
});
