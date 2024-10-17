import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.recorator';


@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Crear un usuario
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  // Obtener todos los usuarios
  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global', 'Administrador de Tienda')
  async getPickersBySucursal(@Args('idSucursal', { type: () => String }) idSucursal: string) {
    return this.userService.getPickersBySucursal(idSucursal);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global', 'Administrador de Tienda')
  async findAllUsers() {
    return this.userService.findAll();
  }

  // Obtener un usuario por email
  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global', 'Administrador de Tienda', 'Picker')
  async findOne(@Args('email', { type: () => String }) email: string) {
    return this.userService.findOneByEmail(email);
  }

  // Actualizar un usuario
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.email, updateUserInput);
  }

  // Actualizar la contraseña de un usuario
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async updateUserPassword(
    @Args('email', { type: () => String }) email: string,
    @Args('newPassword', { type: () => String }) newPassword: string,
  ) {
    return this.userService.updatePassword(email, newPassword);
  }

  // Eliminar un usuario
  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  async removeUser(@Args('email', { type: () => String }) email: string) {
    return this.userService.remove(email);
  }
}
