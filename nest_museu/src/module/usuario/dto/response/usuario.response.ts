import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RolesResponse } from '../../../access/dto/response/roles.response';
import { USUARIO } from '../../constants/usuario.constantes';

export class UsuarioResponse {
  @ApiProperty({ description: USUARIO.SWAGGER.ID_USUARIO, example: '1' })
  @Expose()
  idUsuario!: number;

  @ApiProperty({
    description: USUARIO.SWAGGER.FIRSTNAME,
    example: 'Antônio',
  })
  firstName!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.LASTNAME,
    example: 'Silva',
  })
  lastName!: string;

  @Expose()
  @ApiProperty({
    description: USUARIO.SWAGGER.USERNAME,
    example: 'Antônio da Silva',
  })
  username!: string;

  @ApiProperty({ description: USUARIO.SWAGGER.ACTIVE })
  @Expose()
  active!: boolean;

  @ApiProperty({ description: USUARIO.SWAGGER.IMAGE_PATH })
  imagePath!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.ROLE,
    example: 'administrador',
  })
  @Expose()
  @Type(() => RolesResponse)
  roles!: RolesResponse[];

  constructor(data: Partial<UsuarioResponse> = {}) {
    Object.assign(this, data);
  }
}
