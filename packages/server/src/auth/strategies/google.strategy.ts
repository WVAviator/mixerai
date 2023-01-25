import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;
    const user: User = {
      email: emails[0].value,
      displayName,
      avatarUrl: photos[0].value,
      authService: 'google',
      authServiceId: id,
    };

    done(null, user);
  }
}
