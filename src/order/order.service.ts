import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { OrderFilterInput } from './dto/order-filter-input';
import { AssignOrdersInput } from './dto/assign-orders-input';
import { UpdateOrderInput } from './dto/update-order.input';


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

    if (filter.assignedTo) {
      Logger.log("Entra a esta parte");
      Logger.log(filter.assignedTo);
      query['assignment.assignedTo'] = filter.assignedTo;  // Filtrar a quien le fue asignada la orden
    }
    Logger.log(query);
    return this.orderModel.find(query).exec();
  }

  async assignOrders(input: AssignOrdersInput): Promise<Order[]> {
    const { orderIds, pickerEmail, assignedBy } = input;
    const updatedOrders: Order[] = [];

    for (const orderId of orderIds) {
      const order = await this.orderModel.findOne({ externalOrderId: orderId });
      if (order) {
        order.assignment = {
          assignedBy,
          assignedTo: pickerEmail,
          assignmentDate: new Date(),
        };
        const updatedOrder = await order.save();
        updatedOrders.push(updatedOrder);
      }
    }

    return updatedOrders;
  }

  async updateOrderForPicking(updateOrderInput: UpdateOrderInput): Promise<Order> {
    const { externalOrderId, items, orderStatusBackstore } = updateOrderInput;

    const order = await this.orderModel.findOne({ externalOrderId });
    if (!order) {
      throw new NotFoundException(`No se encontró la orden con externalOrderId: ${externalOrderId}`);
    }

    // Actualizar los ítems de la orden con la cantidad confirmada y motivo de quiebre si aplica
    items.forEach((itemUpdate) => {
      const item = order.items.find((i) => i.productId === itemUpdate.productId);
      if (item) {
        item.quantityConfirmedBackstore = itemUpdate.quantityBackstoreConfirmados;
        item.breakReason = itemUpdate.breakReason || null;
      }
    });

    order.orderBackstoreStatusDate = new Date();
    // Actualizar el estado de la orden para Backstore
    order.orderBackstoreStatus = orderStatusBackstore;

    return order.save();
  }
    
}

