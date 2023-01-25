import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  create(user: User) {
    console.log('Creating new user: ', user);

    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findOneById(id: string) {
    return this.userModel.findOne({ id });
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
