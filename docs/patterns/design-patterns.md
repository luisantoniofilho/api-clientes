# Design Patterns Utilizados

## Patterns Arquiteturais

### Hexagonal Architecture (Ports & Adapters)

**O que é:** Organiza o sistema em três zonas concêntricas — domínio, aplicação e infraestrutura — onde as dependências sempre apontam para dentro.

**Onde está neste projeto:** Estrutura geral de pastas (`domain/`, `application/`, `infrastructure/`).

**Por que foi usado:** Permite testar regras de negócio sem banco de dados, substituir implementações de infraestrutura sem alterar o domínio, e manter o código organizado conforme cresce.

---

## Patterns de Design (GoF)

### Repository Pattern

**O que é:** Abstrai o acesso a dados atrás de uma interface que imita uma coleção de objetos em memória.

**Onde está neste projeto:**

- `src/domain/repositories/cliente.repository.interface.ts` — define o contrato (Port)
- `src/infrastructure/database/typeorm/repositories/cliente.typeorm-repository.ts` — implementa o contrato (Adapter)

**Por que foi usado:** O domínio e a aplicação não sabem como os dados são persistidos. Nos testes unitários, o repositório é substituído por um mock sem tocar no banco.

```typescript
// O use case depende da interface, não da implementação
export class CreateClienteUseCase {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly repository: IClienteRepository, // ← interface
  ) {}
}
```

---

### Factory Method

**O que é:** Método estático que encapsula a criação de objetos, garantindo que nasçam em estado válido.

**Onde está neste projeto:** `src/domain/entities/cliente.entity.ts`

```typescript
// Dois factory methods com propósitos distintos
Cliente.create(nome, email); // novo cliente — gera UUID e timestamps
Cliente.restore(props); // reconstrói do banco — usa dados existentes
```

**Por que foi usado:** O construtor é `private`, impossibilitando criar um `Cliente` inválido (sem id, sem timestamps). Toda criação passa pelo "portão de entrada" controlado.

---

### Dependency Injection / IoC Container

**O que é:** As dependências de uma classe são fornecidas por um container externo em vez de instanciadas pela própria classe.

**Onde está neste projeto:** NestJS IoC container gerencia todas as injeções. O `CLIENTE_REPOSITORY` Symbol conecta a interface ao adapter concreto.

```typescript
// DatabaseModule declara o binding
{ provide: CLIENTE_REPOSITORY, useClass: ClienteTypeOrmRepository }

// Use case recebe a implementação sem saber qual é
@Inject(CLIENTE_REPOSITORY) private readonly repo: IClienteRepository
```

**Por que foi usado:** Facilita troca de implementações (ex: em testes, injeta mock; em produção, injeta TypeORM).

---

### Adapter Pattern

**O que é:** Converte a interface de uma classe em outra interface esperada pelo cliente.

**Onde está neste projeto:**

- `ClienteTypeOrmRepository` adapta a API do TypeORM para a interface `IClienteRepository`
- `ClienteController` adapta o protocolo HTTP para chamadas aos use cases

**Por que foi usado:** O TypeORM e o Fastify têm APIs próprias. Os adapters isolam essas APIs do domínio, que fica limpo.

---

### Strategy Pattern

**O que é:** Define uma família de algoritmos/implementações intercambiáveis por uma interface comum.

**Onde está neste projeto:** `IClienteRepository` é a estratégia. `ClienteTypeOrmRepository` é uma implementação. Em testes, o objeto mockado é outra implementação da mesma estratégia.

**Por que foi usado:** Permite que os use cases funcionem com qualquer implementação de repositório sem modificação.

---

### Decorator Pattern

**O que é:** Adiciona comportamento a objetos sem alterar sua classe, via composição.

**Onde está neste projeto:** Decorators do TypeScript/NestJS e TypeORM:

```typescript
@Controller('clientes')   // define rota base
@Get(':id')               // mapeia método HTTP
@ApiOkResponse(...)       // documenta no Swagger
@IsEmail()                // valida campo do DTO
@Column({ unique: true }) // define coluna no banco
```

**Por que foi usado:** É o mecanismo central do NestJS e TypeORM — adiciona metadados às classes sem modificar a lógica.

---

## Patterns de Domínio

### Entity

**O que é:** Objeto com identidade única (id) e ciclo de vida próprio. Dois objetos com o mesmo id são o mesmo, independente dos outros atributos.

**Onde está neste projeto:** `Cliente` — identificado pelo UUID. Duas instâncias com o mesmo `id` representam o mesmo cliente.

---

### Domain Exception

**O que é:** Exceção específica do domínio que comunica uma violação de regra de negócio com semântica clara.

**Onde está neste projeto:**

- `ClienteNotFoundException` — lançada quando se busca um cliente inexistente
- `ClienteAlreadyExistsException` — lançada quando se tenta cadastrar email duplicado

**Por que foi usado:** Em vez de retornar `null` ou lançar erros genéricos, as exceções de domínio comunicam exatamente o que aconteceu. O `DomainExceptionFilter` as converte em respostas HTTP com status code semântico (404, 409).

---

## Patterns de Aplicação

### Use Case (Interactor)

**O que é:** Uma classe por operação de negócio, com um único método `execute()`.

**Onde está neste projeto:** 7 use cases em `src/application/use-cases/`.

**Por que foi usado:** Cada operação de negócio é independente. Alterar a lógica de criação não pode quebrar a lógica de deleção. Facilita testes unitários focados.

---

### DTO (Data Transfer Object)

**O que é:** Objeto simples sem lógica, usado para transferir dados entre camadas.

**Onde está neste projeto:** `CreateClienteDto`, `UpdateClienteDto`, `ClienteResponseDto` em `src/infrastructure/http/dtos/`.

**Por que foi usado:** Separa o formato da API HTTP do modelo de domínio. O DTO valida o input antes de chegar ao use case. O `ClienteResponseDto` define o formato de saída documentado no Swagger.

---

### Exception Filter

**O que é:** Intercepta exceções específicas e define como tratá-las.

**Onde está neste projeto:** `DomainExceptionFilter` — captura `ClienteNotFoundException` e `ClienteAlreadyExistsException` e as converte em respostas HTTP 404 e 409 com JSON padronizado.

**Por que foi usado:** Separa o tratamento de erros do código de negócio. Os use cases lançam exceções de domínio sem saber nada de HTTP. O filter faz a tradução.
