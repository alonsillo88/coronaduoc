import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response.dto';
import { LoginInput } from './dto/login-input.dto';
import { Logger } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}


  @Mutation(() => LoginResponse)
  async login(@Args('loginInput', { nullable: false }) loginInput: LoginInput) {
    Logger.log("Entra a resolver");
    const user = await this.authService.validateUser(loginInput.email, loginInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  
}
