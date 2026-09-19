# Documentação da API

**Base URL:** `http://localhost:3000`

**Swagger UI:** `http://localhost:3000/api`

---

## Endpoints

### POST /clientes

Cria um novo cliente.

**Request Body:**

```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com"
}
```

**Validações:**

- `nome`: obrigatório, string, mínimo 2 caracteres, máximo 100
- `email`: obrigatório, formato de email válido, único no sistema

**Responses:**

`201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "createdAt": "2026-09-19T03:38:06.279Z",
  "updatedAt": "2026-09-19T03:38:06.279Z"
}
```

`400 Bad Request` — validação falhou

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

`409 Conflict` — email já cadastrado

```json
{
  "statusCode": 409,
  "message": "Cliente com email \"joao@email.com\" já existe",
  "error": "ClienteAlreadyExistsException",
  "timestamp": "2026-09-19T03:38:06.311Z"
}
```

---

### GET /clientes

Retorna todos os clientes cadastrados.

**Response:** `200 OK`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2026-09-19T03:38:06.279Z",
    "updatedAt": "2026-09-19T03:38:06.279Z"
  }
]
```

---

### GET /clientes/count

Retorna o total de clientes cadastrados.

**Response:** `200 OK`

```json
{
  "count": 42
}
```

---

### GET /clientes/nome/:nome

Busca clientes cujo nome contenha o trecho informado (busca parcial, case-insensitive).

**Path Params:**

- `nome`: trecho do nome a buscar

**Exemplo:** `GET /clientes/nome/João`

**Response:** `200 OK`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "createdAt": "2026-09-19T03:38:06.279Z",
    "updatedAt": "2026-09-19T03:38:06.279Z"
  }
]
```

---

### GET /clientes/:id

Busca um cliente pelo ID (UUID).

**Path Params:**

- `id`: UUID do cliente

**Responses:**

`200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "createdAt": "2026-09-19T03:38:06.279Z",
  "updatedAt": "2026-09-19T03:38:06.279Z"
}
```

`404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Cliente com id \"550e8400\" não encontrado",
  "error": "ClienteNotFoundException",
  "timestamp": "2026-09-19T03:38:12.353Z"
}
```

---

### PUT /clientes/:id

Atualiza os dados de um cliente existente.

**Path Params:**

- `id`: UUID do cliente

**Request Body:**

```json
{
  "nome": "João Silva Atualizado",
  "email": "novo.email@email.com"
}
```

**Responses:**

`200 OK` — retorna o cliente atualizado

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva Atualizado",
  "email": "novo.email@email.com",
  "createdAt": "2026-09-19T03:38:06.279Z",
  "updatedAt": "2026-09-19T03:40:00.000Z"
}
```

`404 Not Found` — cliente não encontrado

`409 Conflict` — novo email já pertence a outro cliente

---

### DELETE /clientes/:id

Remove um cliente pelo ID.

**Path Params:**

- `id`: UUID do cliente

**Responses:**

`204 No Content` — deletado com sucesso (sem body)

`404 Not Found` — cliente não encontrado

---

## Formato de Erro Padrão

Todos os erros de domínio seguem o mesmo formato:

```json
{
  "statusCode": 404,
  "message": "Descrição do erro",
  "error": "NomeDaExcecao",
  "timestamp": "2026-09-19T03:38:12.353Z"
}
```

Erros de validação (400) seguem o formato padrão do NestJS:

```json
{
  "statusCode": 400,
  "message": ["nome must be longer than or equal to 2 characters"],
  "error": "Bad Request"
}
```
