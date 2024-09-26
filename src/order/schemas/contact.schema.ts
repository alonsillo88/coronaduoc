import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  documentType: string;

  @Field({ nullable: true })
  document: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  email: string;
}
