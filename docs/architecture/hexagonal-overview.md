# Arquitetura Hexagonal (Ports & Adapters)

## Visão Geral

Este projeto implementa a **Arquitetura Hexagonal**, proposta por Alistair Cockburn em 2005. O objetivo é isolar o núcleo da aplicação (domínio e regras de negócio) da infraestrutura técnica (banco de dados, HTTP, frameworks).

## Princípios Fundamentais

**1. O domínio não conhece a infraestrutura**

A camada de domínio contém apenas TypeScript puro — sem imports de NestJS, TypeORM, Fastify ou qualquer lib externa. Isso garante que as regras de negócio possam ser testadas de forma isolada e não sejam afetadas por mudanças de infraestrutura.

**2. Dependências apontam para dentro**

```
Infrastructure → Application → Domain
```

A infraestrutura conhece a aplicação e o domínio. A aplicação conhece só o domínio. O domínio não conhece ninguém.

**3. Ports & Adapters**

- **Port**: interface definida pelo domínio que especifica o que ele precisa (ex: `IClienteRepository`)
- **Adapter**: implementação concreta de um port na infraestrutura (ex: `ClienteTypeOrmRepository`)

## Camadas do Projeto

### Domain (Núcleo)

```
src/domain/
├── entities/
│   └── cliente.entity.ts          # Entidade com lógica de negócio
├── repositories/
│   └── cliente.repository.interface.ts  # Port de saída
└── exceptions/
    ├── cliente-not-found.exception.ts
    └── cliente-already-exists.exception.ts
```

**Responsabilidades:**

- Definir as entidades do negócio com suas invariantes
- Declarar os contratos (interfaces) que a infraestrutura deve implementar
- Lançar exceções de domínio semanticamente ricas

**Dependências externas:** nenhuma.

### Application (Casos de Uso)

```
src/application/
└── use-cases/
    ├── create-cliente.use-case.ts
    ├── find-all-clientes.use-case.ts
    ├── find-cliente-by-id.use-case.ts
    ├── find-clientes-by-nome.use-case.ts
    ├── count-clientes.use-case.ts
    ├── update-cliente.use-case.ts
    └── delete-cliente.use-case.ts
```

**Responsabilidades:**

- Orquestrar o fluxo de uma operação de negócio
- Chamar o repositório via interface (port), nunca via implementação concreta
- Uma classe por caso de uso (Single Responsibility)

**Dependências externas:** apenas `@nestjs/common` para `@Injectable` e `@Inject`.

### Infrastructure (Adapters)

```
src/infrastructure/
├── database/
│   ├── typeorm/
│   │   ├── entities/
│   │   │   └── cliente.typeorm-entity.ts   # Adapter de persistência
│   │   └── repositories/
│   │       └── cliente.typeorm-repository.ts  # Implementa IClienteRepository
│   └── database.module.ts
└── http/
    ├── controllers/
    │   └── cliente.controller.ts           # Adapter de entrada HTTP
    ├── dtos/
    │   ├── create-cliente.dto.ts
    │   ├── update-cliente.dto.ts
    │   └── cliente-response.dto.ts
    └── filters/
        └── domain-exception.filter.ts
```

**Responsabilidades:**

- Implementar os ports definidos pelo domínio
- Adaptar o protocolo HTTP para chamadas aos use cases
- Converter entre modelos de domínio e modelos de persistência
- Tratar exceções de domínio e convertê-las em respostas HTTP

## Fluxo de uma Requisição

```
POST /clientes { nome, email }
        │
        ▼
ClienteController.create(dto)
  └── valida DTO com class-validator
        │
        ▼
CreateClienteUseCase.execute({ nome, email })
  ├── verifica se email existe via IClienteRepository.findByEmail()
  ├── cria entidade via Cliente.create(nome, email)
  └── persiste via IClienteRepository.save(cliente)
        │
        ▼
ClienteTypeOrmRepository.save(cliente)
  ├── converte Cliente → ClienteTypeOrmEntity
  ├── persiste no SQLite via TypeORM
  └── converte ClienteTypeOrmEntity → Cliente via Cliente.restore()
        │
        ▼
ClienteController retorna cliente.toJSON()
        │
        ▼
HTTP 201 { id, nome, email, createdAt, updatedAt }
```

## Vantagens desta Arquitetura

| Benefício                          | Como se manifesta neste projeto                                          |
| ---------------------------------- | ------------------------------------------------------------------------ |
| **Testabilidade**                  | Use cases testados sem banco — repositório é mockado via interface       |
| **Substituibilidade**              | Trocar SQLite por PostgreSQL = mudar só o `useClass` no `DatabaseModule` |
| **Independência de framework**     | Domínio não importa NestJS — pode ser portado para outro framework       |
| **Separação de responsabilidades** | Cada camada tem uma única razão para mudar                               |
