import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSucursalInput {
  @Field(() => Int)
  idTienda: number;

  @Field()
  codigoPostal: string;

  @Field()
  direccion: string;

  @Field()
  estado: string;

  @Field()
  nombreSucursal: string;

  @Field()
  tipo: string;
}
