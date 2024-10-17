import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';  
import { Model } from 'mongoose';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const createdUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async getPickersBySucursal(idSucursal: string): Promise<User[]> {
    const users = await this.userModel.find({ idSucursal }).exec();
    if (!users) {
      throw new NotFoundException(`User with idSucursal ${idSucursal} not found`);
    }
    return users;
  }

  async update(email: string, updateUserInput: UpdateUserInput): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email }, // Buscar por email
      { $set: updateUserInput }, // Actualizar campos utilizando los valores proporcionados en updateUserInput
      { new: true } // Devolver el usuario actualizado
    );

    if (!updatedUser) {
      throw new NotFoundException(`No se encontró ningún usuario con el email: ${email}`);
    }

    return updatedUser;
  }

  async updatePassword(email: string, newPassword: string): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email }, // Buscar por email
      { password: hashedPassword }, // Actualizar la contraseña
      { new: true } // Devolver el usuario actualizado
    );

    if (!updatedUser) {
      throw new NotFoundException(`No se encontró ningún usuario con el email: ${email}`);
    }

    return updatedUser;
  }

  async remove(email: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return true;
  }
}
