import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './adress.schema';

@ObjectType()
export class Origin {
  @Field()
  facilityId: string;

  @Field()
  facilityName: string;

  @Field(() => Address)
  address: Address;
}
