import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { OrderModule } from './order/order.module';
import { SucursalModule } from './sucursal/sucursal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(`JWT_SECRET: ${configService.get<string>('JWT_SECRET')}`);
        return {
          uri: configService.get<string>('MONGO_URI'),
        };
      },
    }),
    AuthModule,
    UserModule,
    OrderModule,
    SucursalModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      path: '/backstore',
      formatError: (error) => {
        return { message: error.message, code: error.extensions.code };
      },
    }),
  ],
})
export class AppModule {}
