import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

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

  @Prop({ type: [{ name: String, amount: String }], default: [] })
  ingredients: {
    name: string;
    amount: string;
  };

  @Prop()
  directions: string;

  @Prop()
  imageUrl: string;

  @Prop()
  imagePrompt: string;

  @Prop()
  prompt: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
