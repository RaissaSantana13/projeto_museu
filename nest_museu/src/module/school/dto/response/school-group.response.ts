import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SchoolResponse } from './school.response';
import { SchoolRepresentativeResponse } from './school-representative.response';

export class SchoolGroupResponse {
  @ApiProperty({ description: 'ID do grupo', example: 1 })
  @Expose()
  idGroup!: number;

  @ApiProperty({ description: 'Nome da turma/grupo', example: 'Turma 8º Ano A' })
  @Expose()
  groupName!: string;

  @ApiProperty({ description: 'Total de estudantes', example: 35 })
  @Expose()
  totalStudents!: number;

  @ApiProperty({ type: () => SchoolResponse })
  @Expose()
  @Type(() => SchoolResponse)
  school!: SchoolResponse;

  @ApiProperty({ type: () => SchoolRepresentativeResponse, required: false })
  @Expose()
  @Type(() => SchoolRepresentativeResponse)
  representative?: SchoolRepresentativeResponse;

  constructor(data: Partial<SchoolGroupResponse> = {}) {
    Object.assign(this, data);
  }
}