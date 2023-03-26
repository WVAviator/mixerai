import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
import { User, UserDocument } from './schemas/user.schema';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new user in the database.
   * @param user The user to create.
   * @returns The hydrated user document after it has been saved to the database.
   */
  async create(user: User) {
    this.logger.log(`Creating user ${user.email} in database.`);
    try {
      const createdUser = await this.userModel.create(user);
      await createdUser.save();

      this.eventEmitter.emit('user.created', new UserCreatedEvent(createdUser));

      return createdUser;
    } catch (error: any) {
      this.logger.error(`Database error creating user ${user.email}. ${error}`);
      throw new InternalServerErrorException(
        `Error creating user ${user.email}.`,
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Finds a single user based on their id.
   * @param id The string id of the user.
   * @returns The hydrated user docuent from the database.
   */
  async findOneById(id: string) {
    this.logger.log(`Finding user with id ${id}.`);
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({ _id: id });
    } catch (error: any) {
      throw new DatabaseException('Databse error finding user', {
        cause: error,
      });
    }
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  /**
   * Finds a single user based on their email.
   * @param email The email of the user.
   * @returns The hydrated user document from the database.
   */
  async findOneByEmail(email: string) {
    this.logger.log(`Finding user with email ${email}.`);
    let user: UserDocument;
    try {
      user = await this.userModel.findOne({
        email,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Error finding user in database.`,
        {
          cause: error,
        },
      );
    }

    return user;
  }

  /**
   * Removes a user from the database.
   * @param id The string id of the user.
   * @returns The hydrated user document that was removed from the database.
   */
  async remove(id: string) {
    this.logger.log(`Removing user with id ${id}.`);
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    try {
      await user.remove();
      return user;
    } catch (error: any) {
      throw new DatabaseException(`Error removing user from database.`, {
        cause: error,
      });
    }
  }
}
