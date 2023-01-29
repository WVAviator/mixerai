import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

export class AIResponseException extends HttpException {
  constructor(
    message = 'AI Response Exception',
    options?: HttpExceptionOptions,
  ) {
    super(message, HttpStatus.BAD_GATEWAY, options);
  }
}
