import { IsNotEmpty, IsString } from 'class-validator';

export class GenerationOptions {
  @IsString({
    message: 'Prompt must be a string',
  })
  @IsNotEmpty({
    message: 'Prompt must not be empty',
  })
  prompt: string;

  constructor(partial: Partial<GenerationOptions>) {
    Object.assign(this, partial);
  }
}
