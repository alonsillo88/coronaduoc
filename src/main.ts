import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
   // Se selecciona el archivo de configuración del ambiente que se indique.
  // DEV: development
  // PRD: production
  // QA : qa
  const environment = process.env.NODE_ENV ?? 'PRD';
  dotenv.config({ path: `.env.${environment.toLowerCase()}` });
  console.log(`Environment: ${environment}`);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(
      {
        bodyLimit: 10048576 , 
        caseSensitive: false,
      }), 
      {
        logger: process.env.LOG_LEVEL !== 'ALL' ? ['error', 'warn'] : ['error', 'warn', 'debug', 'log']
      }
  );
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(8080, '0.0.0.0');
}

bootstrap();
