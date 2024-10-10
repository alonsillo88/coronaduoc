import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderFilterInput } from './dto/order-filter-input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';  // Importamos el guard de JWT
import { RolesGuard } from '../auth/guards/roles.guard';  // Importamos el guard de roles
import { Roles } from '../auth/decorators/roles.recorator';  // Importamos el decorador de roles

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // Solo usuarios autenticados pueden consultar órdenes
  @Query(() => [Order], { name: 'getOrders' })
  @UseGuards(JwtAuthGuard)
  @Roles('Administrador Global', 'Administrador de Tienda')  // Solo los roles definidos pueden acceder
  async getOrders(@Args('filter', { nullable: true }) filter: OrderFilterInput) {
    return this.orderService.searchOrders(filter);
  }
}
