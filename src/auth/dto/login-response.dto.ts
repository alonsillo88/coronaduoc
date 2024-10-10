import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../../user/entities/role.entity';  // Asegúrate de importar la entidad Role

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

  @Field(() => [Role], { nullable: true })  
  roles: Role[];  

  @Field()
  idSucursal: string;
}
