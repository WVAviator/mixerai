import { TokensService } from './tokens.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TokensController } from './tokens.controller';

describe('TokensController', () => {
  let tokensController: TokensController;
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokensController],
      providers: [{ provide: TokensService, useValue: {} }],
    }).compile();

    tokensController = module.get<TokensController>(TokensController);
  });

  it('should be defined', () => {
    expect(tokensController).toBeDefined();
  });
});
