import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CountClientesUseCase } from '../../../application/use-cases/count-clientes.use-case';
import { CreateClienteUseCase } from '../../../application/use-cases/create-cliente.use-case';
import { DeleteClienteUseCase } from '../../../application/use-cases/delete-cliente.use-case';
import { FindAllClientesUseCase } from '../../../application/use-cases/find-all-clientes.use-case';
import { FindClienteByIdUseCase } from '../../../application/use-cases/find-cliente-by-id.use-case';
import { FindClientesByNomeUseCase } from '../../../application/use-cases/find-clientes-by-nome.use-case';
import { UpdateClienteUseCase } from '../../../application/use-cases/update-cliente.use-case';
import { ClienteResponseDto } from '../dtos/cliente-response.dto';
import { CreateClienteDto } from '../dtos/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/update-cliente.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(
    private readonly createClienteUseCase: CreateClienteUseCase,
    private readonly findAllClientesUseCase: FindAllClientesUseCase,
    private readonly findClienteByIdUseCase: FindClienteByIdUseCase,
    private readonly findClientesByNomeUseCase: FindClientesByNomeUseCase,
    private readonly countClientesUseCase: CountClientesUseCase,
    private readonly updateClienteUseCase: UpdateClienteUseCase,
    private readonly deleteClienteUseCase: DeleteClienteUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ClienteResponseDto })
  @ApiConflictResponse({ description: 'Email já cadastrado' })
  async create(@Body() dto: CreateClienteDto): Promise<ClienteResponseDto> {
    const cliente = await this.createClienteUseCase.execute(dto);
    return cliente.toJSON();
  }

  @Get()
  @ApiOkResponse({ type: [ClienteResponseDto] })
  async findAll(): Promise<ClienteResponseDto[]> {
    const clientes = await this.findAllClientesUseCase.execute();
    return clientes.map((c) => c.toJSON());
  }

  @Get('count')
  @ApiOkResponse({ description: 'Total de clientes', schema: { example: { count: 42 } } })
  async count(): Promise<{ count: number }> {
    const total = await this.countClientesUseCase.execute();
    return { count: total };
  }

  @Get('nome/:nome')
  @ApiOkResponse({ type: [ClienteResponseDto] })
  async findByNome(@Param('nome') nome: string): Promise<ClienteResponseDto[]> {
    const clientes = await this.findClientesByNomeUseCase.execute(nome);
    return clientes.map((c) => c.toJSON());
  }

  @Get(':id')
  @ApiOkResponse({ type: ClienteResponseDto })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  async findById(@Param('id') id: string): Promise<ClienteResponseDto> {
    const cliente = await this.findClienteByIdUseCase.execute(id);
    return cliente.toJSON();
  }

  @Put(':id')
  @ApiOkResponse({ type: ClienteResponseDto })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  @ApiConflictResponse({ description: 'Email já cadastrado' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClienteDto,
  ): Promise<ClienteResponseDto> {
    const cliente = await this.updateClienteUseCase.execute(id, dto);
    return cliente.toJSON();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Cliente deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Cliente não encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteClienteUseCase.execute(id);
  }
}
