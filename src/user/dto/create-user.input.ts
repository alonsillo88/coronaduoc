import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  rut: string;

  @Field(() => String)
  idSucursal: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => String)
  estado: string;
}