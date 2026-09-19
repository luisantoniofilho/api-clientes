import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'João Silva', minLength: 2, maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nome!: string;

  @ApiProperty({ example: 'joao.silva@email.com' })
  @IsEmail()
  email!: string;
}
