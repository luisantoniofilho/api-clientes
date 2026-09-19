export class ClienteNotFoundException extends Error {
  constructor(id: string) {
    super(`Cliente com id "${id}" não encontrado`);
    this.name = 'ClienteNotFoundException';
  }
}
