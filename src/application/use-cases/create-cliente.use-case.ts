import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteAlreadyExistsException } from '../../domain/exceptions/cliente-already-exists.exception';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

export interface CreateClienteInput {
  nome: string;
  email: string;
}

@Injectable()
export class CreateClienteUseCase {
  private readonly logger = new Logger(CreateClienteUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(input: CreateClienteInput): Promise<Cliente> {
    this.logger.log(`Creating cliente with email: ${input.email}`);

    const existing = await this.clienteRepository.findByEmail(input.email);
    if (existing) {
      throw new ClienteAlreadyExistsException(input.email);
    }

    const cliente = Cliente.create(input.nome, input.email);
    const saved = await this.clienteRepository.save(cliente);

    this.logger.log(`Cliente created with id: ${saved.id}`);
    return saved;
  }
}
