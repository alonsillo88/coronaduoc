import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

import { RolesGuard } from '../auth/guards/roles.guard'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { Roles } from 'src/auth/decorators/roles.recorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Solo los usuarios con el rol "admin" pueden crear usuarios
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')  // Solo los usuarios con el rol "Administrador Global"
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global', 'Administrador de Tienda')  // Aquí puedes especificar los roles que pueden acceder
  findAllUsers() {
    return this.userService.findAll();
  }

  // Obtener un usuario por ID, permitido solo para roles específicos
  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global', 'Administrador de Tienda', 'Picker')  // Acceso para todos
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  // Actualizar un usuario, solo administradores globales pueden hacerlo
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  // Eliminar un usuario, acceso restringido a administradores globales
  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador Global')
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
