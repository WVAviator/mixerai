import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  private readonly logger = new Logger(FeedController.name);
  constructor(private readonly feedService: FeedService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  getTrending(@Query('page') page: string) {
    if (!page) {
      this.logger.log('Getting trending recipes from page 1');
      return this.feedService.getTrending(1, 25);
    }
    this.logger.log(`Getting trending recipes from page ${page}`);
    return this.feedService.getTrending(parseInt(page, 10), 25);
  }
}
