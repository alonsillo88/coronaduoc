import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './adress.entity';

@ObjectType()
export class Origin {
  @Field()
  facilityId: string;

  @Field()
  facilityName: string;

  @Field(() => Address)
  address: Address;
}
