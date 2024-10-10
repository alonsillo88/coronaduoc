import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { OrderFilterInput } from './dto/order-filter-input';


@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async searchOrders(filter: OrderFilterInput): Promise<Order[]> {
    const query: any = {};

    // Filtrado dinámico basado en los parámetros
    if (filter.externalOrderId) {
      query.externalOrderId = filter.externalOrderId;
    }
    if (filter.externalSequenceNumber) {
      query.externalSequenceNumber = filter.externalSequenceNumber;
    }
    if (filter.customerName) {
      query['customer.firstName'] = new RegExp(filter.customerName, 'i');
    }
    if (filter.facilityId) {
      query['origin.facilityId'] = filter.facilityId;
    }
    if (filter.orderStatus) {
      query.orderStatus = filter.orderStatus;
    }
    if (filter.deliveryType) {
      query['logisticsInfo.deliveryType'] = filter.deliveryType;  // Filtrar por tipo de entrega
    }

    return this.orderModel.find(query).exec();
  }
}

