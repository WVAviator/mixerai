import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RecipeDocument = HydratedDocument<Recipe>;

export interface Ingredient {
  name: string;
  quantity: string;
}

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Recipe {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  ingredients: Ingredient[];

  @Prop()
  instructions: string;

  @Prop()
  imageUrl: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
