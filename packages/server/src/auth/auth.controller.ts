import {
  Controller,
  Get,
  Logger,
  Redirect,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
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

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthLogin(
    @User() user: UserModel,
    @Response({ passthrough: false }) response: ExpressResponse,
  ) {
    this.logger.log(`Processing Google login for: ${user.email}`);
    const { token, userData } = await this.authService.signIn(user);

    return response.set('mixerai_token', token).json({ user: userData });
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  async googleAuthRedirect(
    @User() user: UserModel,
    @Response({ passthrough: false }) res: ExpressResponse,
  ) {
    this.logger.log(`Processing Google OAuth callback for: ${user.email}`);

    const redirectUrl = new URL(
      process.env.AUTH_REDIRECT_DEEP_LINK || 'mixerai://',
    );

    this.logger.log(`Redirecting to: ${redirectUrl.toString()}`);

    return res.redirect(redirectUrl.toString());
  }
}
