import { Module } from '@nestjs/common';
import { CountClientesUseCase } from '../application/use-cases/count-clientes.use-case';
import { CreateClienteUseCase } from '../application/use-cases/create-cliente.use-case';
import { DeleteClienteUseCase } from '../application/use-cases/delete-cliente.use-case';
import { FindAllClientesUseCase } from '../application/use-cases/find-all-clientes.use-case';
import { FindClienteByIdUseCase } from '../application/use-cases/find-cliente-by-id.use-case';
import { FindClientesByNomeUseCase } from '../application/use-cases/find-clientes-by-nome.use-case';
import { UpdateClienteUseCase } from '../application/use-cases/update-cliente.use-case';
import { DatabaseModule } from './database/database.module';
import { ClienteController } from './http/controllers/cliente.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ClienteController],
  providers: [
    CreateClienteUseCase,
    FindAllClientesUseCase,
    FindClienteByIdUseCase,
    FindClientesByNomeUseCase,
    CountClientesUseCase,
    UpdateClienteUseCase,
    DeleteClienteUseCase,
  ],
})
export class ClienteModule {}
