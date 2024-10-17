import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Assignment {
  @Field()
  assignedBy: string;

  @Field()
  assignedTo: string;

  @Field()
  assignmentDate: Date;
}
