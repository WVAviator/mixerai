import { Module } from '@nestjs/common';
import { RecipeModule } from '../recipe/recipe.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  controllers: [VoteController],
  imports: [RecipeModule],
  providers: [VoteService],
})
export class VoteModule {}
