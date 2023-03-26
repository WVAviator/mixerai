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
});
