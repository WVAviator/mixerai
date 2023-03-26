import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
