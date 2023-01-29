import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class GeneratedIngredient {
  @IsString({
    message: 'Ingredient name was not a string',
  })
  @IsNotEmpty({
    message: 'Ingredient name was missing',
  })
  name: string;

  @IsString({
    message: 'Ingredient amount was not a string',
  })
  @IsNotEmpty({
    message: 'Ingredient amount was missing',
  })
  amount: string;

  constructor(partial: Partial<GeneratedIngredient>) {
    Object.assign(this, partial);
  }
}

export class GeneratedRecipe {
  @IsString({
    message: 'Recipe title was not a string',
  })
  @IsNotEmpty({
    message: 'Recipe title was missing',
  })
  title: string;

  @IsString({
    message: 'Recipe description was not a string',
  })
  @IsNotEmpty({
    message: 'Recipe description was missing',
  })
  description: string;

  @IsArray({
    message: 'Recipe ingredients was not an array',
  })
  @ValidateNested({ each: true, message: 'Recipe ingredient was invalid' })
  @Type(() => GeneratedIngredient)
  ingredients: GeneratedIngredient[];

  @IsString({
    message: 'Recipe directions was not a string',
  })
  @IsNotEmpty({
    message: 'Recipe directions was missing',
  })
  directions: string;

  @IsString({
    message: 'Recipe image prompt was not a string',
  })
  @IsNotEmpty({
    message: 'Recipe image prompt was missing',
  })
  imagePrompt: string;

  constructor(partial: Partial<GeneratedRecipe>) {
    Object.assign(this, partial);
    if (partial.ingredients) {
      this.ingredients = partial.ingredients.map(
        (ingredient) => new GeneratedIngredient(ingredient),
      );
    }
  }
}
