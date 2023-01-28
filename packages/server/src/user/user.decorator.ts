import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User as UserModel } from './schemas/user.schema';

/**
 * A custom decorator that extracts the user from the request object.
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as UserModel;
  },
);
