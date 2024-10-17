import { InputType, Field, Int } from '@nestjs/graphql';

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
  productId: number;

  @Field(() => Int)
  quantityBackstoreConfirmados: number;

  @Field(() => String, { nullable: true })
  breakReason: string;
}
