import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type RecipeDocument = mongoose.HydratedDocument<Recipe>;

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Vote {
  user: User;
  vote: 'like' | 'dislike';
}

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Recipe {
  id?: string;

  @Prop()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  description: string;

  @Prop({ type: [{ name: String, amount: String }], default: [] })
  ingredients: Ingredient[];

  @Prop()
  directions: string;

  @Prop()
  imageUrl: string;

  @Prop()
  imagePrompt: string;

  @Prop()
  prompt: string;

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vote: { type: String, enum: ['like', 'dislike'] },
      },
    ],
    default: [],
  })
  votes: Vote[];

  likes: number;

  dislikes: number;

  userVote: 'like' | 'dislike' | null;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const RecipeSchema = SchemaFactory.createForClass(Recipe);

RecipeSchema.virtual('likes').get(function (this: Recipe) {
  return this.votes.filter((vote) => vote.vote === 'like').length;
});

RecipeSchema.virtual('dislikes').get(function (this: Recipe) {
  return this.votes.filter((vote) => vote.vote === 'dislike').length;
});

RecipeSchema.virtual('userVote').get(function (this: Recipe, user: User) {
  const vote = this.votes.find((vote) => vote.user.id === user.id);
  return vote ? vote.vote : null;
});

export { RecipeSchema };
