import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './adress.entity';

@ObjectType()
export class Destination {
  @Field({ nullable: true })
  facilityId: string;

  @Field({ nullable: true })
  facilityName: string;

  @Field(() => Address)
  address: Address;
}
