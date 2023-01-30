import { Injectable, Logger } from '@nestjs/common';
import { DatabaseException } from '../exceptions/database.exceptions';
import { RecipeService } from '../recipe/recipe.service';
import { RecipeDocument, Vote } from '../recipe/schemas/recipe.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { VoteException } from './vote.exception';

interface VoteOptions {
  recipeId: string;
  user: UserDocument;
  vote?: 'like' | 'dislike';
}
@Injectable()
export class VoteService {
  private readonly logger = new Logger(VoteService.name);
  constructor(private readonly recipeService: RecipeService) {}

  /**
   * Gets the vote for a user on a recipe
   * @param param0 An object containing the recipeId and user
   * @returns A promise that resolves to the vote or null if the user has not voted on this recipe
   */
  async getVote({ recipeId, user }: VoteOptions) {
    const { userVote } = await this.getRecipeVote(recipeId, user);
    return userVote;
  }

  /**
   * Creates a new vote for a user on a recipe
   * @param param0 The recipeId, user, and vote value (either 'like' or 'dislike')
   * @returns A promise that resolves to the updated recipe document
   */
  async createVote({ recipeId, user, vote }: VoteOptions) {
    this.logger.log(`User ${user.id} has voted ${vote} on recipe ${recipeId}.`);
    const { recipe, userVote } = await this.getRecipeVote(recipeId, user);
    this.logger.log(
      `Checked for previous vote on this recipe by user: ${userVote}`,
    );
    if (userVote) {
      throw new VoteException('User has already voted on this recipe.');
    }
    try {
      recipe.votes.push({ userId: user.id, vote });
      await recipe.save();
      return recipe;
    } catch (error) {
      throw new DatabaseException('Database error creating vote', {
        cause: error,
      });
    }
  }

  /**
   * Updates a user's vote on a recipe to a new value
   * @param param0 The recipeId, user, and new vote value (either 'like' or 'dislike')
   * @returns A promise that resolves to the updated recipe document
   */
  async updateVote({ recipeId, user, vote: newVote }: VoteOptions) {
    const { recipe, userVote } = await this.getRecipeVote(recipeId, user);
    if (!userVote) {
      throw new VoteException('User has not voted on this recipe.');
    }
    try {
      recipe.votes = recipe.votes.map((vote) => {
        if (vote.userId === user.id) {
          return { userId: vote.userId, vote: newVote };
        }
        return vote;
      });
      return recipe.save();
    } catch (error) {
      throw new DatabaseException('Database error updating vote', {
        cause: error,
      });
    }
  }

  /**
   * Deletes a user's vote on a recipe
   * @param param0 The recipeId and user
   * @returns A promise that resolves to the updated recipe document
   */
  async deleteVote({ recipeId, user }: VoteOptions) {
    const { recipe, userVote } = await this.getRecipeVote(recipeId, user);
    if (!userVote) {
      throw new VoteException('User has not voted on this recipe.');
    }
    try {
      recipe.votes = recipe.votes.filter((vote) => {
        return vote.userId !== user.id;
      });
      return recipe.save();
    } catch (error) {
      throw new DatabaseException('Database error deleting vote', {
        cause: error,
      });
    }
  }

  private async getRecipeVote(
    recipeId: string,
    user: UserDocument,
  ): Promise<{ recipe: RecipeDocument; userVote: Vote }> {
    const recipe = await this.recipeService.findOne(recipeId);
    const userVote = recipe.votes.find((vote) => {
      return vote.userId === user.id;
    });
    return { recipe, userVote };
  }
}
