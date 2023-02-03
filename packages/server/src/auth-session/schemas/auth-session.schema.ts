import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthSessionDocument = HydratedDocument<AuthSession>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  expireAfterSeconds: 60,
})
export class AuthSession {
  @Prop({ unique: true })
  auid: string;

  @Prop()
  callbackUrl: string;

  @Prop({ isRequired: false })
  userId: string;

  @Prop({ default: false })
  void: boolean;
}

const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);

export { AuthSessionSchema };
