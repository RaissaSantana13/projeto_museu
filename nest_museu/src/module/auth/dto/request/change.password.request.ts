import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Password } from '../../../../commons/decorators/validation/password.decorators';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { USUARIO } from '../../../usuario/constants/usuario.constantes';

export class ChangePasswordRequest {
  @Type(() => Number)
  idUsuario!: number;

  @ApiProperty({ description: USUARIO.SWAGGER.PASSWORD })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'Senha',
    gender: 'f',
  })
  @Password()
  password!: string;

  @ApiProperty({ description: USUARIO.SWAGGER.CONFIRM_PASSWORD })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'Nova Senha',
    gender: 'f',
  })
  @Password()
  confirmPassword!: string;
}
