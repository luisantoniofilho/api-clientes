import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteAlreadyExistsException } from '../../domain/exceptions/cliente-already-exists.exception';
import { ClienteNotFoundException } from '../../domain/exceptions/cliente-not-found.exception';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

export interface UpdateClienteInput {
  nome: string;
  email: string;
}

@Injectable()
export class UpdateClienteUseCase {
  private readonly logger = new Logger(UpdateClienteUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(id: string, input: UpdateClienteInput): Promise<Cliente> {
    this.logger.log(`Updating cliente: ${id}`);

    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new ClienteNotFoundException(id);
    }

    if (input.email !== cliente.email) {
      const emailTaken = await this.clienteRepository.findByEmail(input.email);
      if (emailTaken) {
        throw new ClienteAlreadyExistsException(input.email);
      }
    }

    const updated = cliente.update(input.nome, input.email);
    const saved = await this.clienteRepository.update(updated);

    this.logger.log(`Cliente updated: ${id}`);
    return saved;
  }
}
