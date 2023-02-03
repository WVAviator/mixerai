import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
import { AuthSessionDocument } from './schemas/auth-session.schema';

@Injectable()
export class AuthSessionService {
  constructor(
    @InjectModel('AuthSession')
    private authSessionModel: Model<AuthSessionDocument>,
  ) {}

  async create(auid: string, callbackUrl: string) {
    try {
      const authSession = await this.authSessionModel.create({
        auid,
        callbackUrl,
      });
      return authSession;
    } catch (error) {
      throw new DatabaseException('Error creating authentication session.', {
        cause: error,
      });
    }
  }

  async retrieveAndValidate(auid: string) {
    try {
      const authSession = await this.authSessionModel.findOne({ auid });

      if (!authSession) {
        throw new Error('Authentication session expired.');
      }

      if (!authSession.userId) {
        throw new Error('Authentication session has not been completed.');
      }

      if (authSession.void) {
        // TODO: Attempts to access the same auth session twice should void the user's JWT.
        throw new Error('Authentication session has already been used.');
      }
      authSession.void = true;

      await authSession.save();
      return authSession;
    } catch (error) {
      throw new DatabaseException('Error validating authentication session.', {
        cause: error,
      });
    }
  }

  async updateWithUserId(auid: string, userId: string) {
    try {
      const authSession = await this.authSessionModel.findOne({ auid });

      if (!authSession) {
        throw new Error('Authentication session expired.');
      }

      authSession.userId = userId;
      await authSession.save();
    } catch (error) {
      throw new DatabaseException('Error updating authentication session.', {
        cause: error,
      });
    }
  }
}
