import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cliente, ClienteProps } from '../../../../domain/entities/cliente.entity';
import { IClienteRepository } from '../../../../domain/repositories/cliente.repository.interface';
import { ClienteTypeOrmEntity } from '../entities/cliente.typeorm-entity';

@Injectable()
export class ClienteTypeOrmRepository implements IClienteRepository {
  private readonly logger = new Logger(ClienteTypeOrmRepository.name);

  constructor(
    @InjectRepository(ClienteTypeOrmEntity)
    private readonly repository: Repository<ClienteTypeOrmEntity>,
  ) {}

  async save(cliente: Cliente): Promise<Cliente> {
    const entity = this.toEntity(cliente);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(): Promise<Cliente[]> {
    const entities = await this.repository.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: string): Promise<Cliente | null> {
    const entity = await this.repository.findOneBy({ id });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const entity = await this.repository.findOneBy({ email });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNome(nome: string): Promise<Cliente[]> {
    const entities = await this.repository.findBy({
      nome: Like(`%${nome}%`),
    });
    return entities.map((e) => this.toDomain(e));
  }

  async update(cliente: Cliente): Promise<Cliente> {
    const entity = this.toEntity(cliente);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  private toEntity(cliente: Cliente): ClienteTypeOrmEntity {
    const entity = new ClienteTypeOrmEntity();
    entity.id = cliente.id;
    entity.nome = cliente.nome;
    entity.email = cliente.email;
    entity.createdAt = cliente.createdAt;
    entity.updatedAt = cliente.updatedAt;
    return entity;
  }

  private toDomain(entity: ClienteTypeOrmEntity): Cliente {
    const props: ClienteProps = {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
    return Cliente.restore(props);
  }
}
