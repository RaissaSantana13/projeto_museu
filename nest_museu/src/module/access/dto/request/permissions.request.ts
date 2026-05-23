import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { Resources } from '../../entities/resources.entity';
import { Roles } from '../../entities/role.entity';

export class PermissionsRequest {
  static entityName = PERMISSIONS.ALIAS.toLowerCase();
  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ID_PERMISSIONS,
    example: '1',
  })
  @Type(() => Number)
  @IsOptional()
  idPermission!: number;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ROLE,
    example: 'administrador',
  })
  role!: Roles;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.RESOURCE,
    example: 'eventos',
  })
  resource!: Resources;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ACTION,
    example: 'leitura',
  })
  @TextField({ required: true, min: 8, max: 20, label: 'Ação', gender: 'm' })
  action!: string;

  /*   @ApiProperty({
    description: PERMISSIONS.SWAGGER.POSSESSION,
    example: 'qualquer um',
  })
  @TextField({ required: true, min: 8, max: 100, label: 'Posse', gender: 'm' })
  possession!: string; */

  constructor(data: Partial<PermissionsRequest> = {}) {
    Object.assign(this, data);
  }
}
