import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception thrown when the prompt provided by the user does not pass OpenAI's content moderation policy.
 */
export class ContentModerationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
