import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  documentType: string;

  @Field()
  document: string;

  @Field()
  documentVerifyDigit: string;

  @Field()
  email: string;

  @Field()
  phone: string;
}
