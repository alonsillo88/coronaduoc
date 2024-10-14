import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sucursal } from './entities/sucursal.entity';

@Injectable()
export class SucursalService {
  constructor(@InjectModel(Sucursal.name) private sucursalModel: Model<Sucursal>) {}

  // Obtener todas las sucursales
  async findAll(): Promise<Sucursal[]> {
    Logger.log("Entra a buscar todas las sucursales");
    return await this.sucursalModel.find().exec();
  }

  // Obtener sucursal por idTienda
  async findById(idTienda: number): Promise<Sucursal> {
    const sucursal = await this.sucursalModel.findOne({ idTienda }).exec();
    if (!sucursal) {
      throw new NotFoundException(`Sucursal con idTienda ${idTienda} no encontrada`);
    }
    return sucursal;
  }
}
