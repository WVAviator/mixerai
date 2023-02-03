import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import { AuthSessionService } from '../../auth-session/auth-session.service';

export class EstablishAuthSession implements NestInterceptor {
  constructor(private readonly authSessionService: AuthSessionService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { auid, cb } = request.query;

    if (!auid || !cb) {
      throw new BadRequestException('Missing required query parameters.');
    }

    await this.authSessionService.create(auid, cb);

    return next.handle();
  }
}
