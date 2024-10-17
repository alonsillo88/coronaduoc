import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Payment {
  @Field()
  code: string;

  @Field({ nullable: true })
  codeDescription: string;

  @Field({ nullable: true })
  codeNumber: number;

  @Field({ nullable: true })
  documentNumber: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  installmentsNumber: number;

  @Field({ nullable: true })
  installmentsValue: number;

  @Field({ nullable: true })
  authId: string;

  @Field({ nullable: true })
  value: number;

  @Field({ nullable: true })
  type: string;
}
