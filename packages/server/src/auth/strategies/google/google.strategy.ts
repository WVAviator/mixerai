import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthSessionService } from '../../../auth-session/auth-session.service';
import { User } from '../../../user/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor(private authSessionService: AuthSessionService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  /**
   * The authenticate function is called when the user is redirected to the Google OAuth login page.
   * @param req The request object.
   * @param options The options object, including state query params, to be passed to Google.
   */
  async authenticate(req: any, options?: any) {
    this.logger.log('Google OAuth authentication function initiated.');

    this.logger.log('Auth request query: ', req.query);
    const { auid, cb } = req.query;

    await this.authSessionService.create(auid, cb);

    options.state = auid;
    this.logger.log(`Store auid on options state: ${options.state}`);
    super.authenticate(req, options);
  }

  /**
   * The validate function is called after the user has been authenticated by Google and the user is redirected to the callback URL.
   * @param accessToken The access token returned by Google that can be used to make requests to Google APIs.
   * @param refreshToken The refresh token returned by Google that can be used to refresh the access token.
   * @param profile The profile information returned by Google.
   * @param done The callback function that should be called with the user object to be assigned to req.user.
   */
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;

    this.logger.log(`Google OAuth callback verification for ${displayName}`);

    const user: User = {
      email: emails[0].value,
      displayName,
      avatarUrl: photos[0]?.value ?? '',
      authService: 'google',
      authServiceId: id,
    };

    done(null, user);
  }
}
