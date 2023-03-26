import { TokensService } from './tokens.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';

@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTokens(@User() user: UserDocument) {
    const tokens = await this.tokensService.getTokenCount(user.id);
    return { tokens };
  }
}
