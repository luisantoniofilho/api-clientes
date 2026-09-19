import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteTypeOrmEntity } from './infrastructure/database/typeorm/entities/cliente.typeorm-entity';
import { ClienteModule } from './infrastructure/cliente.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [ClienteTypeOrmEntity],
      synchronize: true,
    }),
    ClienteModule,
  ],
})
export class AppModule {}
