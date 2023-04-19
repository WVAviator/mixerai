import { GenerateModule } from './../generate/generate.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeSchema } from './schemas/recipe.schema';
import { ImageModule } from '../image/image.module';
import { TokenModule } from '../token/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
    GenerateModule,
    ImageModule,
    TokenModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
