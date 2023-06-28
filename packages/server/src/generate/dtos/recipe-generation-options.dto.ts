import { IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';

type OpenAIModel = 'text-davinci-003' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';

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

  @IsString({
    message: 'Model must be a string',
  })
  @IsEnum(['text-davinci-003', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'], {
    message:
      'Model must be text-davinci-003, gpt-3.5-turbo, or gpt-3.5-turbo-0301',
  })
  @IsNotEmpty({
    message: 'Model must not be empty',
  })
  model: OpenAIModel = 'text-davinci-003';

  constructor(partial: Partial<RecipeGenerationOptions>) {
    Object.assign(this, partial);
  }
}
