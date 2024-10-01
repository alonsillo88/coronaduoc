import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { OrderFilterInput } from './dto/order-filter-input';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async search(filter: OrderFilterInput): Promise<Order[]> {
    const query: any = {};

    if (filter.externalOrderId) {
      query.externalOrderId = filter.externalOrderId;
    }
    if (filter.externalSequenceNumber) {
      query.externalSequenceNumber = filter.externalSequenceNumber;
    }
    if (filter.customerName) {
      query['customer.firstName'] = new RegExp(filter.customerName, 'i');
    }
    if (filter.address) {
      query['destination.address.street'] = new RegExp(filter.address, 'i');
    }

    return this.orderModel.find(query).exec();
  }
}
