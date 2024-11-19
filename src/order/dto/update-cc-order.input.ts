import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateCCOrderInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  externalOrderId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  newStatus: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comments?: string;
}
