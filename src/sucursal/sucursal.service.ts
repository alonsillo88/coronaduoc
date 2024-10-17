import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sucursal } from './entities/sucursal.entity';
import { CreateSucursalInput } from './dto/create-sucursal-input.dto';
import { UpdateSucursalInput } from './dto/update-sucursal-input.dto';


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

  // Crear una nueva sucursal
  async create(createSucursalInput: CreateSucursalInput): Promise<Sucursal> {
    const createdSucursal = new this.sucursalModel(createSucursalInput);
    return await createdSucursal.save();
  }

  // Actualizar una sucursal existente
  async update(updateSucursalInput: UpdateSucursalInput): Promise<Sucursal> {
    const { idTienda, ...updateData } = updateSucursalInput;
    const updatedSucursal = await this.sucursalModel.findOneAndUpdate({ idTienda }, updateData, { new: true }).exec();
    if (!updatedSucursal) {
      throw new NotFoundException(`Sucursal con idTienda ${idTienda} no encontrada`);
    }
    return updatedSucursal;
  }

  // Eliminar una sucursal
  async remove(idTienda: number): Promise<Sucursal> {
    const sucursal = await this.sucursalModel.findOneAndDelete({ idTienda }).exec();
    if (!sucursal) {
      throw new NotFoundException(`Sucursal con idTienda ${idTienda} no encontrada`);
    }
    return sucursal;
  }
}
