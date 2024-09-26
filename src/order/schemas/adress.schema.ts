import { Field, ObjectType } from '@nestjs/graphql';
import { Contact } from './contact.schema';

@ObjectType()
export class Address {
  @Field()
  state: string;

  @Field({ nullable: true }) // Permitir null para evitar el error
  community: string;

  @Field()
  city: string;

  @Field()
  street: string;

  @Field()
  number: string;

  @Field({ nullable: true })
  complement: string;

  @Field({ nullable: true })
  postalCode: string;

  @Field({ nullable: true })
  contact: Contact;
}
