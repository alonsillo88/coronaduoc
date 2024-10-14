import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';  // Importar Types para manejar ObjectId
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);  // Instancia de Logger

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    this.logger.log(`Payload recibido: ${JSON.stringify(payload)}`);
  
    const email = payload.email; // Usamos el email en vez del ID
    this.logger.debug(`Buscando usuario con email: ${email}`);
  
    const user = await this.userModel
    .findOne({ email })  // Aquí buscar por email
    .exec();  
  
    if (!user) {
      this.logger.warn('Usuario no encontrado para el token.');
      throw new UnauthorizedException('Usuario no encontrado');
    }
  
    this.logger.log(`Usuario encontrado: ${user.email}`);
    return user;
  }
  
}
