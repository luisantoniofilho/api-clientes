import { INestApplication, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { ClienteModule } from '../../../infrastructure/cliente.module';
import { ClienteTypeOrmEntity } from '../../../infrastructure/database/typeorm/entities/cliente.typeorm-entity';
import { DomainExceptionFilter } from '../../../infrastructure/http/filters/domain-exception.filter';

async function createTestApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        entities: [ClienteTypeOrmEntity],
        synchronize: true,
        dropSchema: true,
      }),
      ClienteModule,
    ],
  }).compile();

  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return app;
}

describe('ClienteController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(async () => {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    await dataSource.getRepository(ClienteTypeOrmEntity).clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /clientes', () => {
    it('deve criar um cliente e retornar 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João Silva', email: 'joao@email.com' })
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.nome).toBe('João Silva');
      expect(res.body.email).toBe('joao@email.com');
    });

    it('deve retornar 409 quando email já existe', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      const res = await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'Outro', email: 'joao@email.com' })
        .expect(409);

      expect(res.body.error).toBe('ClienteAlreadyExistsException');
    });

    it('deve retornar 400 para nome muito curto', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'A', email: 'joao@email.com' })
        .expect(400);
    });

    it('deve retornar 400 para email inválido', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'nao-e-email' })
        .expect(400);
    });
  });

  describe('GET /clientes', () => {
    it('deve retornar lista de clientes', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      const res = await request(app.getHttpServer()).get('/clientes').expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].nome).toBe('João');
    });

    it('deve retornar lista vazia quando não há clientes', async () => {
      const res = await request(app.getHttpServer()).get('/clientes').expect(200);
      expect(res.body).toHaveLength(0);
    });
  });

  describe('GET /clientes/count', () => {
    it('deve retornar o total de clientes', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      const res = await request(app.getHttpServer()).get('/clientes/count').expect(200);

      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /clientes/:id', () => {
    it('deve retornar o cliente pelo id', async () => {
      const created = await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      const res = await request(app.getHttpServer())
        .get(`/clientes/${created.body.id}`)
        .expect(200);

      expect(res.body.id).toBe(created.body.id);
    });

    it('deve retornar 404 para id inexistente', async () => {
      const res = await request(app.getHttpServer()).get('/clientes/id-que-nao-existe').expect(404);

      expect(res.body.error).toBe('ClienteNotFoundException');
    });
  });

  describe('GET /clientes/nome/:nome', () => {
    it('deve retornar clientes que contêm o nome buscado', async () => {
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João Silva', email: 'joao@email.com' });
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João Souza', email: 'souza@email.com' });
      await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'Maria', email: 'maria@email.com' });

      const res = await request(app.getHttpServer()).get('/clientes/nome/João').expect(200);

      expect(res.body).toHaveLength(2);
    });
  });

  describe('PUT /clientes/:id', () => {
    it('deve atualizar o cliente', async () => {
      const created = await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      const res = await request(app.getHttpServer())
        .put(`/clientes/${created.body.id}`)
        .send({ nome: 'João Atualizado', email: 'novo@email.com' })
        .expect(200);

      expect(res.body.nome).toBe('João Atualizado');
      expect(res.body.email).toBe('novo@email.com');
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer())
        .put('/clientes/id-inexistente')
        .send({ nome: 'João', email: 'joao@email.com' })
        .expect(404);
    });
  });

  describe('DELETE /clientes/:id', () => {
    it('deve deletar o cliente e retornar 204', async () => {
      const created = await request(app.getHttpServer())
        .post('/clientes')
        .send({ nome: 'João', email: 'joao@email.com' });

      await request(app.getHttpServer()).delete(`/clientes/${created.body.id}`).expect(204);

      await request(app.getHttpServer()).get(`/clientes/${created.body.id}`).expect(404);
    });

    it('deve retornar 404 para id inexistente', async () => {
      await request(app.getHttpServer()).delete('/clientes/id-inexistente').expect(404);
    });
  });
});
