# Estrutura de Pastas

## Visão Geral

```
api-clientes/
├── src/
│   ├── domain/                    ← Camada de Domínio
│   ├── application/               ← Camada de Aplicação
│   ├── infrastructure/            ← Camada de Infraestrutura
│   ├── shared/                    ← Utilitários compartilhados
│   ├── app.module.ts              ← Módulo raiz do NestJS
│   └── main.ts                    ← Ponto de entrada da aplicação
├── docs/                          ← Documentação
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── vitest.config.ts
└── .prettierrc
```

---

## src/domain — Núcleo do Negócio

```
src/domain/
├── entities/
│   ├── cliente.entity.ts          # Entidade com identidade e comportamento
│   └── cliente.entity.spec.ts     # Testes da entidade
├── repositories/
│   └── cliente.repository.interface.ts  # Port de saída (interface)
└── exceptions/
    ├── cliente-not-found.exception.ts
    └── cliente-already-exists.exception.ts
```

**Regra:** esta pasta não importa nada externo. Zero dependências de libs.

**`entities/`** — Classes que representam os conceitos centrais do negócio. Têm identidade (UUID), lógica própria (validações, comportamentos) e são imutáveis após criadas.

**`repositories/`** — Interfaces que definem o contrato de persistência. O domínio declara o que precisa; a infraestrutura implementa como.

**`exceptions/`** — Erros com semântica de negócio. Substituem retornos `null` por comunicação explícita do que falhou.

---

## src/application — Casos de Uso

```
src/application/
└── use-cases/
    ├── create-cliente.use-case.ts
    ├── find-all-clientes.use-case.ts
    ├── find-cliente-by-id.use-case.ts
    ├── find-clientes-by-nome.use-case.ts
    ├── count-clientes.use-case.ts
    ├── update-cliente.use-case.ts
    ├── delete-cliente.use-case.ts
    └── clientes.use-cases.spec.ts  # Testes dos use cases
```

**Regra:** importa apenas do domínio e do NestJS (`@Injectable`, `@Inject`). Não conhece TypeORM, Fastify ou SQLite.

**`use-cases/`** — Uma classe por operação de negócio. Cada use case tem um único método `execute()`. Orquestra chamadas ao domínio e ao repositório.

---

## src/infrastructure — Adapters

```
src/infrastructure/
├── cliente.module.ts              # Módulo NestJS que agrupa tudo
├── database/
│   ├── database.module.ts         # Módulo de banco de dados
│   └── typeorm/
│       ├── entities/
│       │   └── cliente.typeorm-entity.ts   # Entidade TypeORM (para o banco)
│       └── repositories/
│           └── cliente.typeorm-repository.ts  # Implementa IClienteRepository
└── http/
    ├── controllers/
    │   ├── cliente.controller.ts           # Endpoints HTTP
    │   └── cliente.controller.integration.spec.ts
    ├── dtos/
    │   ├── create-cliente.dto.ts           # Input da API (validação)
    │   ├── update-cliente.dto.ts
    │   └── cliente-response.dto.ts         # Output da API (Swagger)
    └── filters/
        └── domain-exception.filter.ts      # Converte exceções em HTTP
```

**Regra:** pode importar de qualquer camada e de libs externas.

**`database/typeorm/entities/`** — Entidades do TypeORM com decorators `@Entity`, `@Column` etc. São diferentes das entidades de domínio — existem só para o ORM saber como persistir.

**`database/typeorm/repositories/`** — Implementam o contrato `IClienteRepository` usando TypeORM. Fazem a tradução entre objetos de domínio e entidades TypeORM.

**`http/controllers/`** — Recebem requisições HTTP, validam DTOs, chamam o use case correspondente e retornam a resposta.

**`http/dtos/`** — Objetos de transferência de dados para entrada (com `class-validator`) e saída (com `@ApiProperty` para o Swagger).

**`http/filters/`** — Interceptam exceções de domínio e as convertem em respostas HTTP com status code semântico.

---

## Por que duas entidades (domain e TypeORM)?

A entidade de domínio (`cliente.entity.ts`) é imutável, tem lógica de negócio e não conhece banco:

```typescript
// Domínio — TypeScript puro
export class Cliente {
  private constructor(props: ClienteProps) { ... }
  static create(nome, email): Cliente { ... }
  update(nome, email): Cliente { ... }
}
```

A entidade TypeORM (`cliente.typeorm-entity.ts`) é um mapeamento objeto-relacional, sem lógica:

```typescript
// TypeORM — só decorators e campos
@Entity('clientes')
export class ClienteTypeOrmEntity {
  @PrimaryColumn('uuid') id!: string;
  @Column() nome!: string;
}
```

Separá-las garante que uma mudança no schema do banco (ex: renomear uma coluna) não afete o domínio, e vice-versa.

---

## docs — Documentação

```
docs/
├── architecture/
│   ├── hexagonal-overview.md       # Explicação da arquitetura
│   ├── c4-context.drawio           # Diagrama C4 Nível 1 (a criar)
│   ├── c4-container.drawio         # Diagrama C4 Nível 2 (a criar)
│   └── c4-component.drawio         # Diagrama C4 Nível 3 (a criar)
├── patterns/
│   └── design-patterns.md          # Patterns utilizados
└── api/
    └── endpoints.md                # Documentação dos endpoints
```
