import { InternalServerErrorException } from '@nestjs/common';

/**
 * Exception thrown when AI image generation fails or OpenAI is unavailable.
 */
export class ImageGenerationException extends InternalServerErrorException {}
