import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from '@nestjs/common';

/**
 * Exception thrown when AI response is not valid - either not correctly formatted JSON or violates the expected response schema.
 */
export class AIResponseException extends HttpException {
  constructor(
    message = 'AI Response Exception',
    options?: HttpExceptionOptions,
  ) {
    super(message, HttpStatus.BAD_GATEWAY, options);
  }
}
