import { Injectable } from '@nestjs/common';
import { DatabaseException } from '../exceptions/database.exceptions';
import { RecipeService } from '../recipe/recipe.service';
import { User } from '../user/schemas/user.schema';
import { VoteException } from './vote.exception';

interface VoteOptions {
  recipeId: string;
  user: User;
  vote?: 'like' | 'dislike';
}
@Injectable()
export class VoteService {
  constructor(private readonly recipeService: RecipeService) {}

  /**
   * Gets the vote for a user on a recipe
   * @param param0 An object containing the recipeId and user
   * @returns A promise that resolves to the vote value - either 'like', 'dislike', or null if the user has not voted on this recipe
   */
  async getVote({ recipeId, user }: VoteOptions) {
    const recipe = await this.recipeService.findOne(recipeId);
    try {
      const vote = recipe.userVote(user);
      return vote;
    } catch (error) {
      throw new DatabaseException('Database error getting vote', {
        cause: error,
      });
    }
  }

  /**
   * Creates a new vote for a user on a recipe
   * @param param0 The recipeId, user, and vote value (either 'like' or 'dislike')
   * @returns A promise that resolves to the updated recipe document
   */
  async createVote({ recipeId, user, vote }: VoteOptions) {
    const recipe = await this.recipeService.findOne(recipeId);
    const userVote = this.getVote({ recipeId, user });
    if (userVote) {
      throw new VoteException('User has already voted on this recipe.');
    }
    try {
      recipe.votes.push({ user, vote });
      return recipe.save();
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
    const recipe = await this.recipeService.findOne(recipeId);
    const userVote = this.getVote({ recipeId, user });
    if (!userVote) {
      throw new VoteException('User has not voted on this recipe.');
    }
    try {
      recipe.votes = recipe.votes.map((vote) => {
        if (vote.user.id === user.id) {
          return { user, vote: newVote };
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
    const recipe = await this.recipeService.findOne(recipeId);
    const userVote = this.getVote({ recipeId, user });
    if (!userVote) {
      throw new VoteException('User has not voted on this recipe.');
    }
    try {
      recipe.votes = recipe.votes.filter((vote) => {
        return vote.user.id !== user.id;
      });
      return recipe.save();
    } catch (error) {
      throw new DatabaseException('Database error deleting vote', {
        cause: error,
      });
    }
  }
}
