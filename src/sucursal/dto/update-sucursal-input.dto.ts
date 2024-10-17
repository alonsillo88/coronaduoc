import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateSucursalInput } from './create-sucursal-input.dto';


@InputType()
export class UpdateSucursalInput extends PartialType(CreateSucursalInput) {
  @Field(() => Int)
  idTienda: number; // Utilizaremos este campo para buscar la sucursal a actualizar
}
