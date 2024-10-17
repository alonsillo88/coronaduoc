import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './entities/sucursal.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.recorator';
import { CreateSucursalInput } from './dto/create-sucursal-input.dto';
import { UpdateSucursalInput } from './dto/update-sucursal-input.dto';

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

  // Crear una nueva sucursal (solo para Administrador Global)
  @Mutation(() => Sucursal, { name: 'createSucursal' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async createSucursal(@Args('createSucursalInput') createSucursalInput: CreateSucursalInput) {
    return await this.sucursalService.create(createSucursalInput);
  }

  // Actualizar una sucursal existente (solo para Administrador Global)
  @Mutation(() => Sucursal, { name: 'updateSucursal' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async updateSucursal(@Args('updateSucursalInput') updateSucursalInput: UpdateSucursalInput) {
    return await this.sucursalService.update(updateSucursalInput);
  }

  // Eliminar una sucursal (solo para Administrador Global)
  @Mutation(() => Sucursal, { name: 'removeSucursal' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async removeSucursal(@Args('idTienda', { type: () => Int }) idTienda: number) {
    return await this.sucursalService.remove(idTienda);
  }
}
