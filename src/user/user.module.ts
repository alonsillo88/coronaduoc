import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Role, RoleSchema } from './entities/role.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]) // Registra el esquema de Role
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
 