import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenCountSchema } from './schemas/token-count.schema';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { AndroidPublisherProvider } from './providers/android-publisher.provider';

@Module({
  controllers: [TokensController],
  providers: [TokensService, AndroidPublisherProvider],
  imports: [
    MongooseModule.forFeature([
      { name: 'TokenCount', schema: TokenCountSchema },
    ]),
  ],
  exports: [TokensService],
})
export class TokenModule {}
