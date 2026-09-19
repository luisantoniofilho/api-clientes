# API Clientes

API REST para gerenciamento de clientes, desenvolvida como desafio prático do Bootcamp de Arquitetura de Software (Pós-Graduação em Arquitetura de Software e Soluções com IA).

## Sobre o Projeto

Demonstra a aplicação da **Arquitetura Hexagonal (Ports & Adapters)** em um projeto NestJS real, com separação clara entre domínio, aplicação e infraestrutura.

## Stack

| Tecnologia | Versão | Função                                         |
| ---------- | ------ | ---------------------------------------------- |
| Node.js    | 24.x   | Runtime                                        |
| NestJS     | 12.x   | Framework                                      |
| Fastify    | —      | Servidor HTTP (via `@nestjs/platform-fastify`) |
| TypeORM    | 1.x    | ORM                                            |
| SQLite     | —      | Banco de dados (via `better-sqlite3`)          |
| TypeScript | 6.x    | Linguagem                                      |
| Vitest     | 5.x    | Testes                                         |
| ESLint     | 10.x   | Linting                                        |
| Prettier   | 3.x    | Formatação                                     |
| Husky      | 9.x    | Git hooks                                      |

## Arquitetura

O projeto segue a **Arquitetura Hexagonal**, organizando o código em três camadas:

```
src/
├── domain/          # Entidades, interfaces (ports) e exceções — sem dependências externas
├── application/     # Casos de uso — orquestra o fluxo de negócio
└── infrastructure/  # Adapters HTTP (Fastify) e banco (TypeORM)
```

Ver [`docs/architecture/hexagonal-overview.md`](docs/architecture/hexagonal-overview.md) para explicação detalhada.

## Pré-requisitos

- Node.js 24+
- npm 10+

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd api-clientes

# Instalar dependências
npm install
```

## Rodando o Projeto

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

| Método | Rota                   | Descrição       |
| ------ | ---------------------- | --------------- |
| POST   | `/clientes`            | Criar cliente   |
| GET    | `/clientes`            | Listar todos    |
| GET    | `/clientes/count`      | Contar total    |
| GET    | `/clientes/nome/:nome` | Buscar por nome |
| GET    | `/clientes/:id`        | Buscar por ID   |
| PUT    | `/clientes/:id`        | Atualizar       |
| DELETE | `/clientes/:id`        | Deletar         |

Documentação interativa: `http://localhost:3000/api` (Swagger UI)

Ver [`docs/api/endpoints.md`](docs/api/endpoints.md) para exemplos detalhados.

## Testes

```bash
# Rodar todos os testes (unitários + integração)
npm test

# Watch mode
npm run test:watch

# Cobertura de código
npm run test:cov
```

**38 testes** ao todo:

- 11 testes unitários — entidade de domínio
- 13 testes unitários — use cases (com repositório mockado)
- 14 testes de integração — endpoints HTTP (SQLite in-memory)

## Qualidade de Código

```bash
# Lint
npm run lint
npm run lint:fix

# Formatação
npm run format
```

O Husky executa `lint-staged` automaticamente no `pre-commit` — garante que nenhum arquivo com erro de lint seja commitado.

## Documentação

```
docs/
├── architecture/
│   ├── hexagonal-overview.md   # Arquitetura hexagonal
│   ├── c4-context.drawio       # Diagrama C4 — Contexto
│   ├── c4-container.drawio     # Diagrama C4 — Containers
│   └── c4-component.drawio     # Diagrama C4 — Componentes
├── patterns/
│   └── design-patterns.md      # Design patterns utilizados
├── api/
│   └── endpoints.md            # Documentação dos endpoints
└── folder-structure.md         # Estrutura de pastas explicada
```

## Design Patterns Aplicados

- **Hexagonal Architecture** — separação domínio / aplicação / infraestrutura
- **Repository Pattern** — abstração da persistência via interface
- **Factory Method** — criação controlada de entidades (`Cliente.create()`)
- **Dependency Injection** — NestJS IoC container com token Symbol
- **Adapter Pattern** — TypeORM e Fastify adaptados ao domínio
- **Use Case / Interactor** — uma classe por operação de negócio
- **DTO** — separação entre modelo de API e modelo de domínio
- **Exception Filter** — tradução de exceções de domínio para HTTP

Ver [`docs/patterns/design-patterns.md`](docs/patterns/design-patterns.md) para detalhes.
