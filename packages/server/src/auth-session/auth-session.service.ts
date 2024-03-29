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

  /**
   * Creates a new auth session in the database with the given auid and callbackUrl
   * @param auid A unique id generated by the client to identify the auth session
   * @param callbackUrl A url that will return back to the client once authentication is complete
   * @returns The established auth session
   */
  async create(auid: string, callbackUrl: string) {
    this.logger.log(`Creating authentication session for auid "${auid}".`);

    if (!auid) return;

    try {
      const authSession = await this.authSessionModel.create({
        auid,
        callbackUrl,
      });
      return authSession;
    } catch (error: any) {
      throw new DatabaseException('Error creating authentication session.', {
        cause: error,
      });
    }
  }

  /**
   * Retrieves and validates an auth session from the database and then voids it (one time use)
   * @param auid The auth session id of the session to retrieve
   * @returns The retrieved auth session
   */
  async retrieveAndValidate(auid: string) {
    this.logger.log(
      `Attempting to retrieve and validate authentication session for auid "${auid}".`,
    );

    let authSession: AuthSessionDocument;
    try {
      authSession = await this.authSessionModel.findOne({ auid });
    } catch (error: any) {
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

      this.logger.log('Authentication session complete.');
      return authSession;
    } catch (error: any) {
      throw new DatabaseException(
        'Error updating retrieved authentication session.',
        {
          cause: error,
        },
      );
    }
  }

  /**
   * Adds the user ID to the auth session (intended to be added after the user completes OAuth authentication but before they log in to receive a JWT)
   * @param auid The auth session id of the session to update
   * @param userId The user ID to add to the auth session
   * @returns The updated auth session
   */
  async updateWithUserId(auid: string, userId: string) {
    this.logger.log(
      `Attempting to update authentication session for auid "${auid}" with user ID "${userId}".`,
    );
    let authSession: AuthSessionDocument;
    try {
      authSession = await this.authSessionModel.findOne({ auid });
    } catch (error: any) {
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
    } catch (error: any) {
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
