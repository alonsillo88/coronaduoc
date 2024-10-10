import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => [String], { nullable: true })  // Asegúrate de que es un array de strings y sea nullable
  roles: string[];

  @Field()
  idSucursal: string;
}
