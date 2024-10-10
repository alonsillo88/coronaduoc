import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema({ collection: 'roles' })
@ObjectType()
export class Role extends Document {
  
  @Prop({ required: true })
  @Field(() => String, { description: 'Nombre del rol (admin, picker, etc.)' })
  name: string;

  @Prop({ required: true })
  @Field(() => String, { description: 'Permisos asociados a este rol' })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
