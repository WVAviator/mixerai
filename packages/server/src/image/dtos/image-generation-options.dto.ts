import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Options for generating an image.
 */
export class ImageGenerationOptions {
  /**
   * The prompt to use when generating the image.
   */
  @IsString({
    message: 'Prompt must be a string',
  })
  @IsNotEmpty({
    message: 'Prompt must not be empty',
  })
  prompt: string;

  constructor(partial: Partial<ImageGenerationOptions>) {
    Object.assign(this, partial);
  }
}
