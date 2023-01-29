import { IsNotEmpty, IsString } from 'class-validator';

export class ImageGenerationOptions {
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
