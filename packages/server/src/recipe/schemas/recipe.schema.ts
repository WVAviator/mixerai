import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

export type RecipeDocument = mongoose.HydratedDocument<Recipe>;

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Vote {
  userId: string;
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
        userId: { type: String },
        vote: { type: String, enum: ['like', 'dislike'] },
      },
    ],
    default: [],
  })
  votes: Vote[];

  likes: number;
  dislikes: number;
  getUserVote: (user: UserDocument) => Vote | null;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const RecipeSchema = SchemaFactory.createForClass(Recipe);

RecipeSchema.virtual('likes').get(function (this: RecipeDocument) {
  return this.votes.filter((vote) => vote.vote === 'like').length;
});

RecipeSchema.virtual('dislikes').get(function (this: RecipeDocument) {
  return this.votes.filter((vote) => vote.vote === 'dislike').length;
});

RecipeSchema.methods.getUserVote = function (user: UserDocument) {
  const vote = this.votes.find((vote: Vote) => vote.userId === user.id);
  return vote || null;
};

export { RecipeSchema };
