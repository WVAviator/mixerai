import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super({
      // scope: ['email', 'profile'],
      accessType: 'offline',
      // prompt: 'consent',
      // session: false,
      // callbackURL: `${configService.get('APP_URL')}/auth/google/callback`,
    });
  }
}
