import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeDocument } from '../recipe/schemas/recipe.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel('Recipe') private recipeModel: Model<RecipeDocument>,
  ) {}
  getTrending(start: number, end: number) {
    return {
      start,
      end,
    };
  }
}
