import { Recipe } from '../recipe/schemas/recipe.schema';

export interface GenerationOptions {
  prompt: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
  directions: string;
  imagePrompt: string;
}
