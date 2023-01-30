import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Options for generating a recipe, including the prompt to use.
 */
export class RecipeGenerationOptions {
  @IsString({
    message: 'Prompt must be a string',
  })
  @Length(1, 100, {
    message: 'Prompt must be between 1 and 100 characters',
  })
  @IsNotEmpty({
    message: 'Prompt must not be empty',
  })
  prompt: string;

  constructor(partial: Partial<RecipeGenerationOptions>) {
    Object.assign(this, partial);
  }
}
