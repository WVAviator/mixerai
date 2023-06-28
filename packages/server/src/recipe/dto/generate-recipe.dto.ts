import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateRecipeDto {
  @IsString({
    message: 'Prompt must be a string',
  })
  @IsNotEmpty({
    message: 'Prompt must not be empty',
  })
  @MaxLength(100, {
    message: 'Prompt must not be longer than 100 characters',
  })
  prompt: string;
}
