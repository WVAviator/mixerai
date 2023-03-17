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

  /**
   * Returns a pagination of trending recipes calculated by dividing net likes over hours since creation
   * @param page The page to start from
   * @param pageSize The number of recipes to return per page
   * @returns An array of RecipeDocuments
   */
  async getTrending(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    this.logger.log(
      `Getting trending recipes, skipping ${skip} and limiting to ${limit}`,
    );

    const recipes = await this.recipeModel.aggregate<
      Recipe & { popularity: number }
    >([
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          // popularity = (likes - dislikes) / (hours since creation + 1)
          popularity: {
            $divide: [
              {
                $subtract: [
                  {
                    $size: {
                      $filter: {
                        input: '$votes',
                        as: 'vote',
                        cond: { $eq: ['$$vote.vote', 'like'] },
                      },
                    },
                  },
                  {
                    $size: {
                      $filter: {
                        input: '$votes',
                        as: 'vote',
                        cond: { $eq: ['$$vote.vote', 'dislike'] },
                      },
                    },
                  },
                ],
              },
              {
                $add: [
                  {
                    $divide: [
                      { $subtract: [new Date(), '$createdAt'] },
                      3600000,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
      },
      { $sort: { popularity: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    this.logger.log(
      `The top recipes are ${recipes
        .slice(0, 3)
        .map(
          (recipe) => `${recipe.title}: popularity: ${recipe.popularity}`,
        )}.`,
    );

    const recipeDocuments: RecipeDocument[] = recipes.map((recipe) =>
      this.recipeModel.hydrate(recipe),
    );

    return recipeDocuments;
  }
}
