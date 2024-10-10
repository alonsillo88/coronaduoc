import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { Role } from './role.entity';

@Schema({ collection: 'user'})
@ObjectType()
export class User extends Document {
  @Prop({ required: true })
  @Field(() => String)
  firstName: string;

  @Prop({ required: true })
  @Field(() => String)
  lastName: string;

  @Prop({ required: true, unique: true })
  @Field(() => String)
  email: string;

  @Prop({ required: true })
  @Field(() => String)
  password: string;

  @Prop({ required: true })
  @Field(() => String)
  rut: string;

  @Prop({ required: true })
  @Field(() => String)
  idSucursal: string;

  @Prop({ type: [Types.ObjectId], ref: 'Role' })  // Referencia a múltiples roles
  @Field(() => [Role])  // Define un array de roles
  roles: Role[];

  @Prop({ default: Date.now })
  @Field(() => Date)
  lastLogin: Date;

  @Prop({ required: true, enum: ['activo', 'inactivo'] })
  @Field(() => String)
  estado: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
