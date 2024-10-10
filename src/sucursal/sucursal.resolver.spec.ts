import { Test, TestingModule } from '@nestjs/testing';
import { SucursalResolver } from './sucursal.resolver';
import { SucursalService } from './sucursal.service';

describe('SucursalResolver', () => {
  let resolver: SucursalResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SucursalResolver, SucursalService],
    }).compile();

    resolver = module.get<SucursalResolver>(SucursalResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
