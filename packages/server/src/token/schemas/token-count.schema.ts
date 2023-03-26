import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenCountDocument = HydratedDocument<TokenCount>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class TokenCount {
  @Prop({ unique: true })
  userId: string;

  @Prop()
  tokens: number;
}

const TokenCountSchema = SchemaFactory.createForClass(TokenCount);

TokenCountSchema.virtual('id').get(function (this: TokenCountDocument) {
  return this._id.toString();
});

export { TokenCountSchema };
