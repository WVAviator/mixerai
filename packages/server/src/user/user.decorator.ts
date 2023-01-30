import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from './schemas/user.schema';

/**
 * A custom decorator that extracts the user from the request object.
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException(
        'You must be logged in to access this route',
      );
    }

    return request.user as UserDocument;
  },
);
