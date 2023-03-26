import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenCountSchema } from './schemas/token-count.schema';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

@Module({
  controllers: [TokensController],
  providers: [TokensService],
  imports: [
    MongooseModule.forFeature([
      { name: 'TokenCount', schema: TokenCountSchema },
    ]),
  ],
})
export class TokenModule {}
