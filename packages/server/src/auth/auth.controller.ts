import {
  Controller,
  Get,
  Logger,
  Redirect,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Response as ExpressResponse } from 'express';
import { User as UserModel } from '../user/schemas/user.schema';
import { User } from '../user/user.decorator';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    this.logger.log('Redirecting to Google for authentication.');
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  async googleAuthRedirect(
    @User() user: UserModel,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    this.logger.log(`Processing Google OAuth callback for: ${user.email}`);
    const { token, userData } = await this.authService.signIn(user);

    const cookieOptions: CookieOptions = {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    this.logger.log(
      `Obtained JWT token for: ${
        user.email
      }. Setting signed cookie with options: ${JSON.stringify(cookieOptions)}`,
    );

    res.cookie('mixerai_access_token', token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // const redirectUrl = `${process.env.AUTH_REDIRECT_DEEP_LINK || '/'}?id=${
    //   userData.id
    // }/displayName=${userData.displayName}/avatarUrl=${
    //   userData.avatarUrl
    // }/email=${userData.email}`;

    // create an encoded url with the above four properties of user
    const redirectUrl = new URLSearchParams({
      id: userData.id,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrl,
      email: userData.email,
    });

    return {
      statusCode: 302,
      url: redirectUrl.toString(),
    };
  }
}
