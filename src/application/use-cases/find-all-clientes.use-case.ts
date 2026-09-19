import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

@Injectable()
export class FindAllClientesUseCase {
  private readonly logger = new Logger(FindAllClientesUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(): Promise<Cliente[]> {
    this.logger.log('Finding all clientes');
    return this.clienteRepository.findAll();
  }
}
