import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AssignOrdersInput {
  @Field(() => [String])
  orderIds: string[];

  @Field()
  pickerEmail: string;

  @Field()
  assignedBy: string;
}
