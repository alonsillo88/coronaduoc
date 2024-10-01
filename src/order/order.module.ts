import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order, OrderSchema } from './entities/order.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
