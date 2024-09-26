import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field()
  code: string;

  @Field()
  codeDescription: string;

  @Field()
  codeNumber: number;

  @Field()
  documentNumber: string;

  @Field()
  name: string;

  @Field()
  installmentsNumber: number;

  @Field()
  installmentsValue: number;

  @Field({ nullable: true })
  authId: string;

  @Field()
  value: number;

  @Field({ nullable: true })
  type: string;
}
