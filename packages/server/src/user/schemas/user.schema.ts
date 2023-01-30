import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({ virtual: true })
  id?: string;

  @Prop()
  displayName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  authService: 'google' | 'local';

  @Prop()
  authServiceId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
