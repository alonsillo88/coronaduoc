import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './entities/sucursal.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.recorator';


@Resolver(() => Sucursal)
export class SucursalResolver {
  constructor(private readonly sucursalService: SucursalService) {}

  // Obtener todas las sucursales (solo para Administrador Global)
  @Query(() => [Sucursal], { name: 'findAllSucursales' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global') 
  async findAllSucursales() {
    return await this.sucursalService.findAll();
  }

  // Obtener sucursal por idTienda (para Administrador de Tienda y Pickers)
  @Query(() => Sucursal, { name: 'getSucursal' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador de Tienda', 'Picker', 'Administrador Global') 
  async getSucursal(@Args('idTienda', { type: () => Int }) idTienda: number) {
    return await this.sucursalService.findById(idTienda);
  }
}
