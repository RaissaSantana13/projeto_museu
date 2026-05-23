import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { SCHOOL } from '../../constants/school.constantes';

class RepresentativeRequest {
  @TextField({ required: true, label: 'Nome do Representante', gender: 'm' })
  name!: string;

  @TextField({ required: true, label: 'E-mail', gender: 'm', email: true })
  email!: string;

  @TextField({ required: true, label: 'Telefone', gender: 'm' })
  phone!: string;

  @TextField({ required: true, label: 'Cargo', gender: 'm' })
  role!: string;
}

export class SchoolRequest {
  static entityName = SCHOOL.ALIAS.toLowerCase();

  @ApiProperty({
    description: SCHOOL.SWAGGER.ID_SCHOOL,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  idSchool?: number;

  @ApiProperty({
    description: SCHOOL.SWAGGER.NAME,
    example: 'Escola Estadual João da Silva',
  })
  @TextField({
    required: true,
    min: 3,
    max: 150,
    label: 'Nome da Escola',
    gender: 'f',
  })
  name!: string;

  @ApiProperty({
    description: SCHOOL.SWAGGER.CNPJ,
    example: '12.345.678/0001-90',
    required: false,
  })
  @TextField({
    required: false,
    min: 14,
    max: 18,
    label: 'CNPJ',
    gender: 'm',
  })
  @IsOptional()
  cnpj?: string;

  @ApiProperty({ type: [RepresentativeRequest], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RepresentativeRequest)
  representatives?: RepresentativeRequest[];

  constructor(data: Partial<SchoolRequest> = {}) {
    Object.assign(this, data);
  }
}
