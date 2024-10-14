import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalResolver } from './sucursal.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Sucursal, SucursalSchema } from './entities/sucursal.entity';

@Module({
  providers: [SucursalResolver, SucursalService],
})

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Sucursal.name, schema: SucursalSchema }])

  ],
  providers: [SucursalResolver, SucursalService],
})
export class SucursalModule {}
