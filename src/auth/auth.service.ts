import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/entities/user.entity';
import { AuthToken } from './entities/auth-token.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(AuthToken.name) private authTokenModel: Model<AuthToken>,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        this.logger.log('Iniciando validación del usuario...');
        
        const user = await this.userModel.findOne({ email }).exec();  // No necesitamos `populate`
        
        if (!user) {
            this.logger.warn(`No se encontró el usuario con email: ${email}`);
            throw new UnauthorizedException('Credenciales inválidas');
        }
        
        this.logger.log('Comparando contraseñas...');
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            this.logger.log('Contraseña válida, usuario autenticado.');
            return user;
        } else {
            this.logger.warn('Contraseña incorrecta.');
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }

    async login(user: any) {
        this.logger.log('Generando token JWT...');
        
        const payload = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            sub: user._id,
            roles: user.roles,  // Ya deberían ser strings (nombres de los roles)
            idSucursal: user.idSucursal,
        };
        
        const accessToken = this.jwtService.sign(payload);
        
        await this.userModel.updateOne(
            { _id: user._id },
            { lastLogin: new Date() }
        );
        
        this.logger.log('Token JWT generado con éxito y lastLogin actualizado.');
        
        return {
            accessToken,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,  // Asegúrate que sea un array de strings (nombres)
            idSucursal: user.idSucursal,
        };
    } 
}
