import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput {
  @Field(() => String)
  externalOrderId: string;

  @Field(() => [UpdateItemInput])
  items: UpdateItemInput[];

  @Field(() => String, { nullable: true })
  orderStatusBackstore: string;
}

@InputType()
export class UpdateItemInput {
  @Field(() => Number)
  ean: number;

  @Field(() => Number)
  quantityBackstoreConfirmados: number;

  @Field(() => String, { nullable: true })
  breakReason: string;
}
