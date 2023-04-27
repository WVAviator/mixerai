import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginEvent } from '../auth/events/user-login.event';
import { RecipeCreatedEvent } from '../recipe/events/recipe-created.event';
import { UserCreatedEvent } from '../user/events/user-created.event';
import { TokenCount } from './schemas/token-count.schema';
import { PurchaseDto } from './dtos/purchase.dto';
import { AndroidPublisherProvider } from './providers/android-publisher.provider';

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);
  constructor(
    @InjectModel('TokenCount') private tokenCountModel: Model<TokenCount>,
    private androidPublisherProvider: AndroidPublisherProvider,
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    this.logger.log(
      `User created event received for user ${event.userDocument.email}.`,
    );
    try {
      await this.tokenCountModel.create({
        userId: event.userDocument.id,
        tokens: 3,
      });
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error creating token count for user ${event.userDocument.email}.`,
        cause: error,
      });
    }
  }

  @OnEvent('user.login')
  async handleUserLoginEvent(event: UserLoginEvent) {
    this.logger.log(
      `User login event received for user ${event.userDocument.email}.`,
    );
    try {
      const tokenCountDocument = await this.tokenCountModel.findOne({
        userId: event.userDocument.id,
      });

      if (!tokenCountDocument) {
        this.logger.log(
          `No token count document found for user ${event.userDocument.email}. Creating one.`,
        );
        await this.tokenCountModel.create({
          userId: event.userDocument.id,
          tokens: 3,
        });
      }
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
    const userId = event.userDocument.id;

    try {
      const tokenCountDocument = await this.tokenCountModel.findOneAndUpdate(
        { userId },
        { $inc: { tokens: -1 } },
        { new: true },
      );
      return tokenCountDocument.tokens;
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error updating token count for user ${userId}.`,
        cause: error,
      });
    }
  }

  async increaseTokenCount(userId: string, amount: number) {
    try {
      const tokenCountDocument = await this.tokenCountModel.findOneAndUpdate(
        { userId },
        { $inc: { tokens: amount } },
        { new: true },
      );
      return tokenCountDocument.tokens;
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `Error increasing token count for user ${userId}.`,
        cause: error,
      });
    }
  }

  async purchaseTokens(userId: string, purchaseDto: PurchaseDto) {
    if (purchaseDto.purchaseToken) {
      const { packageName, productId, purchaseToken } = purchaseDto;
      const purchaseInfo = await this.androidPublisherProvider.getPurchase({
        packageName,
        productId,
        purchaseToken,
      });
      if (
        purchaseInfo.purchaseState === 0 &&
        purchaseInfo.consumptionState === 1
      ) {
        const tokenQuantity = parseInt(productId.split('_')[1]);
        return await this.increaseTokenCount(userId, tokenQuantity);
      } else {
        throw new InternalServerErrorException({
          message: `Error verifying token purchase for user ${userId}. Purchase state: ${purchaseInfo.purchaseState}. Consumption state: ${purchaseInfo.consumptionState}.`,
        });
      }
    }

    if (purchaseDto.transactionReceipt) {
      //iOS
      // return await this.verifyTokenPurchaseIOS(purchaseDto);
    }

    throw new InternalServerErrorException({
      message: `Error verifying token purchase for user ${userId}. No purchase token or transaction receipt provided.`,
    });
  }
}
