import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AuthToken extends Document {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
