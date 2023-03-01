import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeSchema } from '../recipe/schemas/recipe.schema';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  providers: [FeedService],
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
  ],
  controllers: [FeedController],
})
export class FeedModule {}
