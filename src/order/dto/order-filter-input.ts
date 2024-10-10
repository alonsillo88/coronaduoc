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
  facilityId?: string; 
  @Field({ nullable: true })
  orderStatus?: string; 

  @Field({ nullable: true })
  deliveryType?: string;  
}
