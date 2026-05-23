import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SCHOOL } from '../../constants/school.constants';

export class SchoolResponse {
  @ApiProperty({
    description: SCHOOL.SWAGGER.ID_SCHOOL,
    example: 1,
  })
  @Expose()
  idSchool!: number;

  @ApiProperty({
    description: SCHOOL.SWAGGER.NAME,
    example: 'Escola Estadual João da Silva',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: SCHOOL.SWAGGER.CNPJ,
    example: '12.345.678/0001-90',
  })
  @Expose()
  cnpj?: string;

  constructor(data: Partial<SchoolResponse> = {}) {
    Object.assign(this, data);
  }
}
