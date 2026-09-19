import { randomUUID } from 'crypto';

export interface ClienteProps {
  id: string;
  nome: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Cliente {
  readonly id: string;
  readonly nome: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: ClienteProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(nome: string, email: string): Cliente {
    const now = new Date();
    return new Cliente({
      id: randomUUID(),
      nome,
      email,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: ClienteProps): Cliente {
    return new Cliente(props);
  }

  update(nome: string, email: string): Cliente {
    return new Cliente({
      id: this.id,
      nome,
      email,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  toJSON(): ClienteProps {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
