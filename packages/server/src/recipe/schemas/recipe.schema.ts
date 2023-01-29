import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Ingredient } from '../types';

export type RecipeDocument = mongoose.HydratedDocument<Recipe>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Recipe {
  @Prop({ virtual: true })
  id: string;

  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  description: string;

  @Prop()
  ingredients: Ingredient[];

  @Prop()
  instructions: string;

  @Prop()
  imageUrl: string;

  @Prop()
  prompt: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
