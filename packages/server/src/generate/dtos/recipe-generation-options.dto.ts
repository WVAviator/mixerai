import { IsNotEmpty, IsString } from 'class-validator';

export class RecipeGenerationOptions {
  @IsString({
    message: 'Prompt must be a string',
  })
  @IsNotEmpty({
    message: 'Prompt must not be empty',
  })
  prompt: string;

  constructor(partial: Partial<RecipeGenerationOptions>) {
    Object.assign(this, partial);
  }
}
