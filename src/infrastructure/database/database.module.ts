import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CLIENTE_REPOSITORY } from '../../domain/repositories/cliente.repository.interface';
import { ClienteTypeOrmEntity } from './typeorm/entities/cliente.typeorm-entity';
import { ClienteTypeOrmRepository } from './typeorm/repositories/cliente.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteTypeOrmEntity])],
  providers: [
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteTypeOrmRepository,
    },
  ],
  exports: [CLIENTE_REPOSITORY],
})
export class DatabaseModule {}
