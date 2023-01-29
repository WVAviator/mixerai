import { InternalServerErrorException } from '@nestjs/common';

export class ImageGenerationException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
