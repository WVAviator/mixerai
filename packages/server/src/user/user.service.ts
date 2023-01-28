import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(user: User) {
    this.logger.log(`Creating user ${user.email} in database.`);
    try {
      const createdUser = await this.userModel.create(user);
      return createdUser.save();
    } catch (error) {
      this.logger.error(`Database error creating user ${user.email}. ${error}`);
      throw new InternalServerErrorException(
        `Error creating user ${user.email}. ${error}`,
      );
    }
  }

  async findOneById(id: string) {
    this.logger.log(`Finding user with id ${id}.`);
    try {
      const user = await this.userModel.findOne({ id });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Database error finding user by id: ${id}.`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error finding user in database.`);
    }
  }

  async findOneByEmail(email: string) {
    this.logger.log(`Finding user with email ${email}.`);
    try {
      const user = await this.userModel.findOne({
        email,
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Database error finding user by email: ${email}.`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error finding user in database. ${error}`,
      );
    }
  }

  async remove(id: string) {
    this.logger.log(`Removing user with id ${id}.`);
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found.`);
      }
      await user.remove();
      return user;
    } catch (error) {
      this.logger.error(`Database error removing user with id: ${id}.`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error removing user in database.`,
      );
    }
  }
}
