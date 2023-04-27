import { TokensService } from './tokens.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { PurchaseDto } from './dtos/purchase.dto';

@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTokens(@User() user: UserDocument) {
    const tokens = await this.tokensService.getTokenCount(user.id);
    return { tokens };
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchaseTokens(
    @User() user: UserDocument,
    @Body() purchaseDto: PurchaseDto,
  ) {
    return this.tokensService.purchaseTokens(user.id, purchaseDto);
  }
}
