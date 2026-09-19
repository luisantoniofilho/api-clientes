import { Cliente } from '../entities/cliente.entity';

export interface IClienteRepository {
  save(cliente: Cliente): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findById(id: string): Promise<Cliente | null>;
  findByEmail(email: string): Promise<Cliente | null>;
  findByNome(nome: string): Promise<Cliente[]>;
  update(cliente: Cliente): Promise<Cliente>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}

export const CLIENTE_REPOSITORY = Symbol('IClienteRepository');
