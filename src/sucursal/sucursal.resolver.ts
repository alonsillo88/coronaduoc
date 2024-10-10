import { Resolver } from '@nestjs/graphql';
import { SucursalService } from './sucursal.service';

@Resolver()
export class SucursalResolver {
  constructor(private readonly sucursalService: SucursalService) {}
}
