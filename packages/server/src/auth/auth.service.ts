import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticationSessionException } from '../auth-session/auth-session.exception';
import { AuthSessionService } from '../auth-session/auth-session.service';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { UserLoginEvent } from './events/user-login.event';
import { JwtPayload } from './strategies/jwt/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authSessionService: AuthSessionService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Generates a JWT for a user given their one-time-use auth session id.
   * @param user The user passed in from Passport authentication.
   * @returns A JWT token that should be set on the response cookies.
   */
  async login({ auid }: LoginDto) {
    this.logger.log(`Fetching auth session with auid: ${auid}...`);
    const authSession = await this.authSessionService.retrieveAndValidate(auid);
    this.logger.log(
      `Auth session found: ${authSession}. Fetching user with id: ${authSession.userId}...`,
    );
    const user = await this.userService.findOneById(authSession.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    this.logger.log(`Signing in user: ${user.email}`);
    const token = this.generateJwt({
      email: user.email,
      sub: user.id,
    });

    this.eventEmitter.emit('user.login', new UserLoginEvent(user));

    return { userData: user, token };
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  /**
   * Extracts the callback url from the auth session given a valid request object with user attached.
   * @param request A express request object with user attached.
   * @returns A promise that resolves to the callback url provided on initiation of the auth session.
   */
  async processAuthCallback(request: Request) {
    const user = request.user as User;

    let userDocument = await this.userService.findOneByEmail(user.email);

    if (!userDocument) {
      this.logger.log(
        "New user detected. Creating user's account in the database.",
      );
      userDocument = await this.userService.create(user);
    }

    this.logger.log(`Extracting auid from query parameters...`);

    const auid: string = request.query.state as string;

    this.logger.log(`Extracted auid: ${auid}`);

    if (!auid) {
      this.logger.error(
        'Attempt to access protected route failed - no auid in query parameters.',
      );
      throw new AuthenticationSessionException('No auid in query parameters.');
    }

    this.logger.log(`Updating auth session ${auid} with userId...`);

    const { callbackUrl } = await this.authSessionService.updateWithUserId(
      auid,
      userDocument.id,
    );

    this.logger.log(
      `Auth session ${auid} updated with userId. Completing OAuth flow...`,
    );

    return { callbackUrl };
  }
}
