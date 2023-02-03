import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Redirect,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  CookieOptions,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
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
  async googleAuthRedirect(@Request() request: ExpressRequest & { info: any }) {
    this.logger.log('Redirecting to app after Google authentication.');
    const { callbackUrl } = request.info;
    this.logger.log(`Callback URL: ${callbackUrl}`);
    return {
      url: callbackUrl || process.env.AUTH_REDIRECT_DEEP_LINK,
      statusCode: 302,
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Response() response: ExpressResponse,
  ) {
    const { token, userData } = await this.authService.login(loginDto);

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      signed: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };

    response.cookie('mixerai_access_token', token, cookieOptions);

    return {
      message: 'Successfully logged in.',
      user: userData,
    };
  }
}
