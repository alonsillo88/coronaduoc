import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class LogisticsInfo {
  @Field()
  deliveryType: string;

  @Field()
  deliveryOptions: string;

  @Field()
  methodShippingCode: string;

  @Field({ nullable: true })
  methodShippingDescription: string;

  @Field({ nullable: true })
  estimateShipping: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  estimateShippingDate: Date;

  @Field()
  priceShipping: number;

  @Field({ nullable: true })
  locationAvailabilityDttm: string;

  @Field({ nullable: true })
  pickupStartDttm: string;

  @Field({ nullable: true })
  pickupEndDttm: string;

  @Field({ nullable: true })
  designatedCurierCode: string;

  @Field({ nullable: true })
  designatedCurierDescription: string;

  @Field({ nullable: true })
  deliveryStartDttm: string;

  @Field({ nullable: true })
  deliveryEndDttm: string;

  @Field({ nullable: true })
  manifestNumber: string;

  @Field({ nullable: true })
  trackingNumber: string;

  @Field({ nullable: true })
  trackingUrl: string;
}
