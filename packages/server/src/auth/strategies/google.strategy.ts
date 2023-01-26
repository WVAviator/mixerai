import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'],
    });
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
    this.logger.log(
      `Google OAuth callback verification for profile: ${JSON.stringify(
        profile,
      )}`,
    );
    const { id, displayName, emails, photos } = profile;
    const user: User = {
      email: emails[0].value,
      displayName,
      avatarUrl: photos[0]?.value ?? '',
      authService: 'google',
      authServiceId: id,
    };

    this.logger.log(
      `Constructed user object from profile and assigning to req.user: ${JSON.stringify(
        user,
      )}`,
    );

    done(null, user);
  }
}
