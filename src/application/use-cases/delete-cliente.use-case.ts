import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClienteNotFoundException } from '../../domain/exceptions/cliente-not-found.exception';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

@Injectable()
export class DeleteClienteUseCase {
  private readonly logger = new Logger(DeleteClienteUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(`Deleting cliente: ${id}`);

    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new ClienteNotFoundException(id);
    }

    await this.clienteRepository.delete(id);
    this.logger.log(`Cliente deleted: ${id}`);
  }
}
