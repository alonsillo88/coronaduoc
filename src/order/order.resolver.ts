import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.schema';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async getOrders() {
    return this.orderService.findAll();
  }

  @Mutation(() => Order)
  async createOrder(@Args('item') item: string, @Args('quantity') quantity: number) {
    return this.orderService.create({ item, quantity });
  }

  @Query(() => Order)
  async getOrder(@Args('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  async deleteOrder(@Args('id') id: string) {
    return this.orderService.delete(id);
  }

  @Mutation(() => Order)
  async updateOrder(@Args('id') id: string, @Args('item') item: string, @Args('quantity') quantity: number) {
    return this.orderService.update(id, { item, quantity });
  }
}
