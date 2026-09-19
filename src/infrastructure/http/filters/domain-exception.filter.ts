import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ClienteAlreadyExistsException } from '../../../domain/exceptions/cliente-already-exists.exception';
import { ClienteNotFoundException } from '../../../domain/exceptions/cliente-not-found.exception';

interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
}

@Catch(ClienteNotFoundException, ClienteAlreadyExistsException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(
    exception: ClienteNotFoundException | ClienteAlreadyExistsException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const statusCode =
      exception instanceof ClienteNotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.CONFLICT;

    const response: ErrorResponse = {
      statusCode,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    };

    this.logger.warn(`Domain exception: ${exception.name} - ${exception.message}`);

    void reply.status(statusCode).send(response);
  }
}
