import { ApiProperty } from '@nestjs/swagger';

export class ClienteResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'João Silva' })
  nome!: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  email!: string;

  @ApiProperty({ example: '2026-09-18T10:30:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-18T10:30:00.000Z' })
  updatedAt!: Date;
}
