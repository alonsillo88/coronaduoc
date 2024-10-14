import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;  // Si no hay roles requeridos, permitimos el acceso
    }
    Logger.log("Entra a el siguiente LUGAR!");
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;  
    Logger.debug("Roles del usuario:", user.roles);
    Logger.debug("Roles requeridos:", requiredRoles);
    const hasRequiredRole = user.roles.some((role: string) => {
      return requiredRoles.includes(role);
    });

    if (hasRequiredRole) {
      Logger.log('El usuario tiene acceso');
    } else {
      Logger.log('El usuario no tiene los roles necesarios');
    }
  
    return hasRequiredRole;
  }
}
