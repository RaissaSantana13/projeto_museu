import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PERMISSIONS } from '../../constants/permissions.constants';
import { Permissions } from '../../entities/permissions.entity';
import { ResourcesResponse } from './resources.response';
import { RolesResponse } from './roles.response';

export class PermissionsResponse {
  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ID_PERMISSIONS,
    example: 1,
  })
  @Expose()
  idPermissions!: number;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ROLE,
    example: 'administrador',
  })
  @Expose()
  @Type(() => RolesResponse)
  role!: RolesResponse;

  @Expose()
  nomeRoles?: string;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.RESOURCE,
    example: 'eventos',
  })
  @Expose()
  @Type(() => ResourcesResponse)
  resource!: ResourcesResponse;

  @Expose()
  nomeResources?: string;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.ACTION,
    example: 'leitura',
  })
  @Expose()
  action!: string;

  @ApiProperty({
    description: PERMISSIONS.SWAGGER.POSSESSION,
    example: 'qualquer um',
  })
  @Expose()
  possession!: string;

  constructor(data: Partial<Permissions> = {}) {
    Object.assign(this, data);
    this.nomeRoles = data.role?.nomeRoles;
    this.nomeResources = data.resource?.nomeResources;
  }
}
