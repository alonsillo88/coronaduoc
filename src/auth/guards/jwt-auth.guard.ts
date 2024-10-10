import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('Iniciando validación del JWT...');

    // Delegamos la validación a Passport.js, pero usando el contexto de GraphQL
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);  // Transformamos el ExecutionContext a un contexto de GraphQL
    const request = ctx.getContext().req;  // Extraemos el request del contexto de GraphQL
    this.logger.log('Request obtenido desde el contexto de GraphQL');
    return request;  // Retornamos el request para que Passport lo valide
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error('Error o usuario no encontrado en el permiso solicitado:', err?.message || 'No user');
      if (info && info.message === 'No auth token') {
        this.logger.warn('No se proporcionó token JWT');
        throw new UnauthorizedException('No se proporcionó token JWT');
      }
      throw err || new UnauthorizedException();
    }
    this.logger.log(`Usuario autenticado: ${user.email}`);
    return user;
  }
}
