import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../recipe/schemas/recipe.schema';

@Injectable()
export class FeedService {
  private logger = new Logger(FeedService.name);

  constructor(
    @InjectModel('Recipe') private recipeModel: Model<RecipeDocument>,
  ) {}

  async getTrending(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;
    const recipes = await this.recipeModel.aggregate<
      Recipe & { popularity: number }
    >([
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          popularity: {
            $divide: [
              { $subtract: ['$likes', '$dislikes'] },
              { $divide: [{ $subtract: [new Date(), '$createdAt'] }, 3600000] },
            ],
          },
        },
      },
      { $sort: { popularity: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const recipeDocuments: RecipeDocument[] = recipes.map((recipe) =>
      this.recipeModel.hydrate(recipe),
    );

    this.logger.log(
      `The top recipes are ${recipes
        .slice(0, 3)
        .map(
          (recipe) => `${recipe.title}: popularity: ${recipe.popularity}`,
        )}.`,
    );

    return recipeDocuments;
  }
}
