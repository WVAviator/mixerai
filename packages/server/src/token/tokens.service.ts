import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeCreatedEvent } from '../recipe/events/recipe-created.event';
import { UserCreatedEvent } from '../user/events/user-created.event';
import { TokenCount } from './schemas/token-count.schema';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);
  constructor(
    @InjectModel('TokenCount') private tokenCountModel: Model<TokenCount>,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    this.logger.log(
      `User created event received for user ${event.userDocument.email}.`,
    );
    try {
      await this.tokenCountModel.create({
        userId: event.userDocument._id,
        count: 3,
      });
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error creating token count for user ${event.userDocument.email}.`,
        cause: error,
      });
    }
  }

  async getTokenCount(userId: string) {
    try {
      const tokenCountDocument = await this.tokenCountModel.findOne({ userId });
      return tokenCountDocument.tokens;
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error getting token count for user ${userId}.`,
        cause: error,
      });
    }
  }

  @OnEvent('recipe.created')
  async handleRecipeCreatedEvent(event: RecipeCreatedEvent) {
    this.logger.log(
      `Recipe created event received for recipe ${event.recipeDocument.name}.`,
    );
    try {
      const tokenCountDocument = await this.tokenCountModel.findOne({
        userId: event.recipeDocument.userId,
      });
      tokenCountDocument.tokens = tokenCountDocument.tokens - 1;
      await tokenCountDocument.save();
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error updating token count for user ${event.recipeDocument.userId}.`,
        cause: error,
      });
    }
  }
}
