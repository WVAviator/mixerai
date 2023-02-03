import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseException } from '../exceptions/database.exceptions';
import { AuthenticationSessionException } from './auth-session.exception';
import { AuthSessionDocument } from './schemas/auth-session.schema';

@Injectable()
export class AuthSessionService {
  private logger = new Logger(AuthSessionService.name);
  constructor(
    @InjectModel('AuthSession')
    private authSessionModel: Model<AuthSessionDocument>,
  ) {}

  async create(auid: string, callbackUrl: string) {
    this.logger.log(`Creating authentication session for auid "${auid}".`);
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
    this.logger.log(
      `Attempting to retrieve and validate authentication session for auid "${auid}".`,
    );

    let authSession: AuthSessionDocument;
    try {
      authSession = await this.authSessionModel.findOne({ auid });
    } catch (error) {
      throw new DatabaseException('Error retrieving authentication session.', {
        cause: error,
      });
    }

    if (!authSession) {
      throw new AuthenticationSessionException(
        'Authentication session expired.',
      );
    }

    if (!authSession.userId) {
      throw new AuthenticationSessionException(
        'Authentication session has not been completed.',
      );
    }

    if (authSession.void) {
      // TODO: Attempts to access the same auth session twice should void the user's JWT.
      throw new AuthenticationSessionException(
        'Authentication session has already been used.',
      );
    }
    authSession.void = true;

    try {
      await authSession.save();
      return authSession;
    } catch (error) {
      throw new DatabaseException(
        'Error updating retrieved authentication session.',
        {
          cause: error,
        },
      );
    }
  }

  async updateWithUserId(auid: string, userId: string) {
    this.logger.log(
      `Attempting to update authentication session for auid "${auid}" with user ID "${userId}".`,
    );
    let authSession: AuthSessionDocument;
    try {
      authSession = await this.authSessionModel.findOne({ auid });
    } catch (error) {
      throw new DatabaseException('Error updating authentication session.', {
        cause: error,
      });
    }

    if (!authSession) {
      throw new AuthenticationSessionException(
        'Authentication session expired.',
      );
    }

    authSession.userId = userId;
    try {
      await authSession.save();
    } catch (error) {
      throw new DatabaseException(
        'Error updating retrieved authentication session.',
        {
          cause: error,
        },
      );
    }

    return authSession;
  }
}
