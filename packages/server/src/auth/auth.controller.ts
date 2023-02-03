import { Controller, Get, Logger, Response, UseGuards } from '@nestjs/common';
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

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(
    @User() user: UserModel,
    @Response() response: ExpressResponse,
  ) {
    const { token } = await this.authService.signIn(user);

    response.cookie('mixerai_access_token', token, {
      httpOnly: true,
      signed: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return response.redirect(process.env.AUTH_REDIRECT_DEEP_LINK);
  }
}
