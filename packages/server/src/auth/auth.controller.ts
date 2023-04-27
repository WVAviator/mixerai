import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
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
import { FacebookOAuthGuard } from './guards/facebook-oauth.guard';

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
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    const { callbackUrl } = await this.authService.processAuthCallback(request);

    return response.redirect(callbackUrl);
  }

  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth() {
    this.logger.log('Redirecting to Facebook for authentication.');
  }

  @Get('facebook/callback')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuthRedirect(
    @Request() request: ExpressRequest,
    @Response() response: ExpressResponse,
  ) {
    const { callbackUrl } = await this.authService.processAuthCallback(request);

    return response.redirect(callbackUrl);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) response: ExpressResponse,
  ) {
    this.logger.log(`Logging in user with auid: ${loginDto.auid}.`);
    const { token, userData } = await this.authService.login(loginDto);

    this.logger.log(`Setting cookie for user with auid: ${loginDto.auid}.`);
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
