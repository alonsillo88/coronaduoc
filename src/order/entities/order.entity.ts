import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { Customer } from './customer.entity';
import { Destination } from './destination.entity';
import { Item } from './item.entity';
import { LogisticsInfo } from './logistics-info.entity';
import { Origin } from './origin.entity';
import { Payment } from './payment.entity';
import { History } from './history.entity';
import { Assignment } from './assingment.entity';

@Schema()
@ObjectType()
export class Order extends Document {
    @Prop({ required: true })
    @Field()
    externalOrderId: string;

    @Prop({ default: null })
    @Field({ nullable: true })
    cancelReason: string;

    @Prop({ required: true })
    @Field()
    creationDate: Date;

    @Prop({ type: Object })
    @Field(() => Customer)
    customer: Customer;

    @Prop({ type: Object })
    @Field(() => Destination)
    destination: Destination;

    @Prop({ default: 0 })
    @Field()
    discountValue: number;

    @Prop({ default: [] })
    @Field(() => [String], { nullable: true })
    dte: string[];

    @Prop({ required: true })
    @Field()
    externalDate: Date;

    @Prop({ default: null })
    @Field({ nullable: true })
    externalSequenceNumber: string;

    @Prop({ type: [{ system: String, creationDate: Date, attributes: Array }] })
    @Field(() => [History])
    history: History[];

    @Prop({ type: [{ type: Object }] })
    @Field(() => [Item])
    items: Item[];

    @Prop({ required: true })
    @Field()
    lastChangeDate: Date;

    @Prop({ type: Object })
    @Field(() => LogisticsInfo)
    logisticsInfo: LogisticsInfo;

    @Prop({ required: true })
    @Field()
    orderId: number;

    @Prop({ required: true })
    @Field()
    orderStatus: string;

    @Prop({ required: true })
    @Field()
    orderStatusDescription: string;

    @Prop({ type: Object })
    @Field(() => Origin)
    origin: Origin;

    @Prop({ type: [{ type: Object }] })
    @Field(() => [Payment])
    payment: Payment[];

    @Prop({ default: [] })
    @Field(() => [String], { nullable: true })
    promotions: string[];

    @Prop({ required: true })
    @Field()
    shipValue: number;

    @Prop({ required: true })
    @Field()
    source: string;

    @Prop({ required: true })
    @Field()
    subTotalValue: number;

    @Prop({ required: true })
    @Field()
    taxValue: number;

    @Prop({ required: true })
    @Field()
    totalValue: number;

    @Prop({ default: null })
    @Field({ nullable: true })
    orderBackstoreStatus: string;

    @Prop({ type: Object, default: null })
    @Field(() => Assignment, { nullable: true })
    assignment: Assignment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
