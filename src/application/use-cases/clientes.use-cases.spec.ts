import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cliente } from '../../domain/entities/cliente.entity';
import { ClienteAlreadyExistsException } from '../../domain/exceptions/cliente-already-exists.exception';
import { ClienteNotFoundException } from '../../domain/exceptions/cliente-not-found.exception';
import { IClienteRepository } from '../../domain/repositories/cliente.repository.interface';
import { CountClientesUseCase } from './count-clientes.use-case';
import { CreateClienteUseCase } from './create-cliente.use-case';
import { DeleteClienteUseCase } from './delete-cliente.use-case';
import { FindAllClientesUseCase } from './find-all-clientes.use-case';
import { FindClienteByIdUseCase } from './find-cliente-by-id.use-case';
import { UpdateClienteUseCase } from './update-cliente.use-case';

const makeRepository = (): IClienteRepository => ({
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  findByNome: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
});

const makeCliente = () =>
  Cliente.restore({
    id: 'test-uuid',
    nome: 'João Silva',
    email: 'joao@email.com',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

describe('CreateClienteUseCase', () => {
  let useCase: CreateClienteUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new CreateClienteUseCase(repository);
  });

  it('deve criar cliente quando email não existe', async () => {
    vi.mocked(repository.findByEmail).mockResolvedValue(null);
    vi.mocked(repository.save).mockImplementation((c) => Promise.resolve(c));

    const result = await useCase.execute({ nome: 'João', email: 'joao@email.com' });

    expect(result.nome).toBe('João');
    expect(result.email).toBe('joao@email.com');
    expect(repository.save).toHaveBeenCalledOnce();
  });

  it('deve lançar ClienteAlreadyExistsException quando email já existe', async () => {
    vi.mocked(repository.findByEmail).mockResolvedValue(makeCliente());

    await expect(useCase.execute({ nome: 'João', email: 'joao@email.com' })).rejects.toThrow(
      ClienteAlreadyExistsException,
    );

    expect(repository.save).not.toHaveBeenCalled();
  });
});

describe('FindAllClientesUseCase', () => {
  let useCase: FindAllClientesUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new FindAllClientesUseCase(repository);
  });

  it('deve retornar lista de clientes', async () => {
    const clientes = [makeCliente(), makeCliente()];
    vi.mocked(repository.findAll).mockResolvedValue(clientes);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(repository.findAll).toHaveBeenCalledOnce();
  });

  it('deve retornar lista vazia quando não há clientes', async () => {
    vi.mocked(repository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});

describe('FindClienteByIdUseCase', () => {
  let useCase: FindClienteByIdUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new FindClienteByIdUseCase(repository);
  });

  it('deve retornar cliente quando encontrado', async () => {
    const cliente = makeCliente();
    vi.mocked(repository.findById).mockResolvedValue(cliente);

    const result = await useCase.execute('test-uuid');

    expect(result.id).toBe('test-uuid');
  });

  it('deve lançar ClienteNotFoundException quando não encontrado', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);

    await expect(useCase.execute('inexistente')).rejects.toThrow(ClienteNotFoundException);
  });
});

describe('UpdateClienteUseCase', () => {
  let useCase: UpdateClienteUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new UpdateClienteUseCase(repository);
  });

  it('deve atualizar cliente com sucesso', async () => {
    const cliente = makeCliente();
    const atualizado = cliente.update('Novo Nome', 'novo@email.com');

    vi.mocked(repository.findById).mockResolvedValue(cliente);
    vi.mocked(repository.findByEmail).mockResolvedValue(null);
    vi.mocked(repository.update).mockResolvedValue(atualizado);

    const result = await useCase.execute('test-uuid', {
      nome: 'Novo Nome',
      email: 'novo@email.com',
    });

    expect(result.nome).toBe('Novo Nome');
    expect(result.email).toBe('novo@email.com');
  });

  it('deve lançar ClienteNotFoundException quando cliente não existe', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute('inexistente', { nome: 'Novo', email: 'novo@email.com' }),
    ).rejects.toThrow(ClienteNotFoundException);
  });

  it('deve lançar ClienteAlreadyExistsException quando novo email já pertence a outro cliente', async () => {
    const cliente = makeCliente();
    const outro = Cliente.restore({
      ...cliente.toJSON(),
      id: 'outro-id',
      email: 'outro@email.com',
    });

    vi.mocked(repository.findById).mockResolvedValue(cliente);
    vi.mocked(repository.findByEmail).mockResolvedValue(outro);

    await expect(
      useCase.execute('test-uuid', { nome: 'João', email: 'outro@email.com' }),
    ).rejects.toThrow(ClienteAlreadyExistsException);
  });

  it('deve permitir atualizar mantendo o mesmo email', async () => {
    const cliente = makeCliente();
    const atualizado = cliente.update('Novo Nome', cliente.email);

    vi.mocked(repository.findById).mockResolvedValue(cliente);
    vi.mocked(repository.update).mockResolvedValue(atualizado);

    const result = await useCase.execute('test-uuid', {
      nome: 'Novo Nome',
      email: 'joao@email.com',
    });

    expect(result.nome).toBe('Novo Nome');
    expect(repository.findByEmail).not.toHaveBeenCalled();
  });
});

describe('DeleteClienteUseCase', () => {
  let useCase: DeleteClienteUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new DeleteClienteUseCase(repository);
  });

  it('deve deletar cliente com sucesso', async () => {
    vi.mocked(repository.findById).mockResolvedValue(makeCliente());
    vi.mocked(repository.delete).mockResolvedValue(undefined);

    await expect(useCase.execute('test-uuid')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('test-uuid');
  });

  it('deve lançar ClienteNotFoundException quando cliente não existe', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);

    await expect(useCase.execute('inexistente')).rejects.toThrow(ClienteNotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});

describe('CountClientesUseCase', () => {
  let useCase: CountClientesUseCase;
  let repository: ReturnType<typeof makeRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new CountClientesUseCase(repository);
  });

  it('deve retornar o total de clientes', async () => {
    vi.mocked(repository.count).mockResolvedValue(42);

    const result = await useCase.execute();

    expect(result).toBe(42);
  });
});
