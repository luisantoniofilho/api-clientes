import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteNotFoundException } from '../../domain/exceptions/cliente-not-found.exception';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

@Injectable()
export class FindClienteByIdUseCase {
  private readonly logger = new Logger(FindClienteByIdUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(id: string): Promise<Cliente> {
    this.logger.log(`Finding cliente by id: ${id}`);

    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new ClienteNotFoundException(id);
    }

    return cliente;
  }
}
