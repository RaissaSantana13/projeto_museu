import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentRequest {
  @ApiProperty({ description: 'Nome completo do estudante' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ description: 'Telefone de contato', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'E-mail do estudante', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Documento / Matrícula / RG', required: false })
  @IsString()
  @IsOptional()
  identification?: string;
}

export class UpdateStudentRequest extends CreateStudentRequest {}