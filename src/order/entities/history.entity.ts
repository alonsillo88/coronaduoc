import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class History {
  @Field()
  system: string;

  @Field()
  creationDate: Date;

  @Field(() => [HistoryAttribute])
  attributes: HistoryAttribute[];
}

@ObjectType()
export class HistoryAttribute {
  @Field()
  dataType: string;

  @Field()
  field: string;

  @Field()
  oldValue: string;

  @Field()
  newValue: string;
}
