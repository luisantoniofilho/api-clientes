import { describe, expect, it } from 'vitest';
import { Cliente } from './cliente.entity';

describe('Cliente Entity', () => {
  describe('create', () => {
    it('deve criar um cliente com id UUID gerado automaticamente', () => {
      const cliente = Cliente.create('João Silva', 'joao@email.com');

      expect(cliente.id).toBeDefined();
      expect(cliente.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('deve criar um cliente com nome e email corretos', () => {
      const cliente = Cliente.create('João Silva', 'joao@email.com');

      expect(cliente.nome).toBe('João Silva');
      expect(cliente.email).toBe('joao@email.com');
    });

    it('deve criar um cliente com timestamps gerados automaticamente', () => {
      const before = new Date();
      const cliente = Cliente.create('João Silva', 'joao@email.com');
      const after = new Date();

      expect(cliente.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(cliente.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(cliente.updatedAt.getTime()).toEqual(cliente.createdAt.getTime());
    });

    it('deve criar dois clientes com ids distintos', () => {
      const cliente1 = Cliente.create('João', 'joao@email.com');
      const cliente2 = Cliente.create('Maria', 'maria@email.com');

      expect(cliente1.id).not.toBe(cliente2.id);
    });
  });

  describe('restore', () => {
    it('deve restaurar um cliente com os dados exatos fornecidos', () => {
      const createdAt = new Date('2026-01-01');
      const updatedAt = new Date('2026-06-01');

      const cliente = Cliente.restore({
        id: 'existing-id',
        nome: 'Maria',
        email: 'maria@email.com',
        createdAt,
        updatedAt,
      });

      expect(cliente.id).toBe('existing-id');
      expect(cliente.nome).toBe('Maria');
      expect(cliente.email).toBe('maria@email.com');
      expect(cliente.createdAt).toBe(createdAt);
      expect(cliente.updatedAt).toBe(updatedAt);
    });
  });

  describe('update', () => {
    it('deve retornar um novo objeto com os dados atualizados', () => {
      const original = Cliente.create('João', 'joao@email.com');
      const atualizado = original.update('João Novo', 'novo@email.com');

      expect(atualizado.nome).toBe('João Novo');
      expect(atualizado.email).toBe('novo@email.com');
    });

    it('deve manter o mesmo id após update', () => {
      const original = Cliente.create('João', 'joao@email.com');
      const atualizado = original.update('João Novo', 'novo@email.com');

      expect(atualizado.id).toBe(original.id);
    });

    it('deve manter o createdAt original após update', () => {
      const original = Cliente.create('João', 'joao@email.com');
      const atualizado = original.update('João Novo', 'novo@email.com');

      expect(atualizado.createdAt).toBe(original.createdAt);
    });

    it('deve atualizar o updatedAt após update', () => {
      const original = Cliente.create('João', 'joao@email.com');

      const before = new Date();
      const atualizado = original.update('João Novo', 'novo@email.com');
      const after = new Date();

      expect(atualizado.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(atualizado.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('não deve mutar o objeto original', () => {
      const original = Cliente.create('João', 'joao@email.com');
      const nomeOriginal = original.nome;

      original.update('João Novo', 'novo@email.com');

      expect(original.nome).toBe(nomeOriginal);
    });
  });

  describe('toJSON', () => {
    it('deve retornar um objeto com todas as propriedades', () => {
      const cliente = Cliente.create('João', 'joao@email.com');
      const json = cliente.toJSON();

      expect(json).toEqual({
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        createdAt: cliente.createdAt,
        updatedAt: cliente.updatedAt,
      });
    });
  });
});
