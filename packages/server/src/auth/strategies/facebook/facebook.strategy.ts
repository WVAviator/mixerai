import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-facebook';
import { AuthSessionService } from '../../../auth-session/auth-session.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../user/schemas/user.schema';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  private readonly logger = new Logger(FacebookStrategy.name);
  constructor(
    private authSessionService: AuthSessionService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  /**
   * The authenticate function is called when the user is redirected to the Facebook OAuth login page.
   * @param req The request object.
   * @param options The options object, including state query params, to be passed to Facebook.
   */
  async authenticate(req: any, options?: any) {
    this.logger.log('Facebook OAuth authentication function initiated.');

    this.logger.log('Auth request query: ', req.query);
    const { auid, cb } = req.query;

    await this.authSessionService.create(auid, cb);

    options.state = auid;
    this.logger.log(`Store auid on options state: ${options.state}`);
    super.authenticate(req, options);
  }

  /**
   * The validate function is called after the user has been authenticated by Facebook and the user is redirected to the callback URL.
   * @param accessToken The access token returned by Facebook that can be used to make requests to Facebook APIs.
   * @param refreshToken The refresh token returned by Facebook that can be used to refresh the access token.
   * @param profile The profile information returned by Facebook.
   * @param done The callback function that should be called with the user object to be assigned to req.user.
   */
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;

    this.logger.log(`Facebook OAuth callback verification for ${displayName}`);

    const user: User = {
      email: emails[0].value,
      displayName,
      avatarUrl: photos[0]?.value ?? '',
      authService: 'facebook',
      authServiceId: id,
    };

    done(null, user);
  }
}
