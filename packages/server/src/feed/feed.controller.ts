import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getTrending(@Query('page') page: string) {
    if (!page) {
      return this.feedService.getTrending(1, 25);
    }
    return this.feedService.getTrending(parseInt(page, 10), 25);
  }
}
