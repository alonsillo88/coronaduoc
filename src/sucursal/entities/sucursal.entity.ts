import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Document } from 'mongoose';

@Schema({ collection: 'sucursal' })
@ObjectType()
export class Sucursal extends Document {

    @Prop({ required: true })
    @Field(() => Int, { description: 'ID único de la sucursal en el sistema CORONA' })
    idTienda: number;

    @Prop({ required: true })
    @Field(() => String, { description: 'Código postal de la sucursal' })
    codigoPostal: string;

    @Prop({ required: true })
    @Field(() => String, { description: 'Dirección de la sucursal' })
    direccion: string;

    @Prop({ required: true })
    @Field(() => String, { description: 'Estado de operación de la sucursal (activo/inactivo)' })
    estado: string;

    @Prop({ required: true })
    @Field(() => String, { description: 'Nombre de la sucursal' })
    nombreSucursal: string;

    @Prop({ required: true })
    @Field(() => String, { description: 'Tipo de tienda (por ejemplo, despacho a domicilio, click and collect)' })
    tipo: string;
}

export const SucursalSchema = SchemaFactory.createForClass(Sucursal);
