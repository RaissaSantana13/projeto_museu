import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StudentResponse {
  @ApiProperty({ description: 'ID do estudante', example: 1 })
  @Expose()
  idStudent!: number;

  @ApiProperty({ description: 'Nome completo', example: 'Carlos Eduardo' })
  @Expose()
  fullName!: string;

  @ApiProperty({ description: 'Telefone', example: '(18) 99999-8888', required: false })
  @Expose()
  phone?: string;

  @ApiProperty({ description: 'E-mail', example: 'carlos@email.com', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ description: 'Documento/Matrícula', example: '123456789', required: false })
  @Expose()
  identification?: string;

  constructor(data: Partial<StudentResponse> = {}) {
    Object.assign(this, data);
  }
}