import { Controller, Get } from '@nestjs/common';

@Controller('tokens')
export class TokensController {
  @Get()
  async getTokens() {
    return {
      tokens: 1,
    };
  }
}
