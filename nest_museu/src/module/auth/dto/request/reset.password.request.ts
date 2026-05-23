import { ApiProperty } from '@nestjs/swagger';
import { Password } from '../../../../commons/decorators/validation/password.decorators';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { USUARIO } from '../../../usuario/constants/usuario.constantes';

export class ResetPasswordRequest {
  @ApiProperty({ description: USUARIO.SWAGGER.EMAIL })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'Senha',
    gender: 'f',
  })
  @Password()
  password!: string;
  token!: string;
}
