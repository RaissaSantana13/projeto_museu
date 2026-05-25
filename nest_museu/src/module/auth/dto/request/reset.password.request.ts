import { ApiProperty } from '@nestjs/swagger';
import { Password } from '../../../../commons/decorators/validation/password.decorator';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { USUARIO } from '../../../usuario/constants/usuario.constants';

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
