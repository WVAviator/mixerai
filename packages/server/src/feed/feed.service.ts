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
          likes: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.vote', 'like'] },
              },
            },
          },
          dislikes: {
            $size: {
              $filter: {
                input: '$votes',
                as: 'vote',
                cond: { $eq: ['$$vote.vote', 'dislike'] },
              },
            },
          },
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
      `The top recipes are ${JSON.stringify(recipes.slice(0, 3))}.`,
    );

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
