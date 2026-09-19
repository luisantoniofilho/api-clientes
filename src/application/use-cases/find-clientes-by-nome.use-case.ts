import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

@Injectable()
export class FindClientesByNomeUseCase {
  private readonly logger = new Logger(FindClientesByNomeUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(nome: string): Promise<Cliente[]> {
    this.logger.log(`Finding clientes by nome: ${nome}`);
    return this.clienteRepository.findByNome(nome);
  }
}
