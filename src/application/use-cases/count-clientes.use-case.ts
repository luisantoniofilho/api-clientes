import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CLIENTE_REPOSITORY,
  IClienteRepository,
} from '../../domain/repositories/cliente.repository.interface';

@Injectable()
export class CountClientesUseCase {
  private readonly logger = new Logger(CountClientesUseCase.name);

  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async execute(): Promise<number> {
    this.logger.log('Counting clientes');
    return this.clienteRepository.count();
  }
}
