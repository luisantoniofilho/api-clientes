import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateClienteDto {
  @ApiProperty({ example: 'João Silva Atualizado', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nome!: string;

  @ApiProperty({ example: 'joao.novo@email.com' })
  @IsEmail()
  email!: string;
}
