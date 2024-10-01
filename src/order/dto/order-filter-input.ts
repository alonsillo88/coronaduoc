import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderFilterInput {
  @Field({ nullable: true })
  externalOrderId?: string;

  @Field({ nullable: true })
  externalSequenceNumber?: string;

  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  address?: string;
}
