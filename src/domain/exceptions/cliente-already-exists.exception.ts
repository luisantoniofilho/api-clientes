export class ClienteAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Cliente com email "${email}" já existe`);
    this.name = 'ClienteAlreadyExistsException';
  }
}
