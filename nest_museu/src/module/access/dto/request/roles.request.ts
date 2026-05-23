import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { ROLES } from '../../constants/roles.constants';

export class RolesRequest {
  static entityName = ROLES.ALIAS.toLowerCase();
  @ApiProperty({
    description: ROLES.SWAGGER.ID_ROLE,
    example: '1',
  })
  @Type(() => Number)
  @IsOptional()
  idRoles!: number;

  @ApiProperty({
    description: ROLES.SWAGGER.NOME_ROLE,
    example: 'administrador',
  })
  @TextField({ required: true, min: 8, max: 100, label: 'Nome', gender: 'f' })
  nomeRoles!: string;

  constructor(data: Partial<RolesRequest> = {}) {
    Object.assign(this, data);
  }
}
