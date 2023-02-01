import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from '../recipe/recipe.module';
import { RecipeSchema } from '../recipe/schemas/recipe.schema';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  controllers: [VoteController],
  imports: [RecipeModule],
  providers: [VoteService],
})
export class VoteModule {}
