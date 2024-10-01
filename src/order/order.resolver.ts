import { Resolver, Query, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderFilterInput } from './dto/order-filter-input';


@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async searchOrders(@Args('filter') filter: OrderFilterInput) {
    return this.orderService.search(filter);
  }
}
