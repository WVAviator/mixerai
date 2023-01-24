import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req): string {
    console.log('Cookie: ', req.cookies['mixerai_access_token']);
    return this.appService.getHello();
  }
}
