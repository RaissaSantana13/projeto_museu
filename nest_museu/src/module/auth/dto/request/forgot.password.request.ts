import { ApiProperty } from '@nestjs/swagger';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { USUARIO } from '../../../usuario/constants/usuario.constants';

export class ForgotPasswordRequest {
  @ApiProperty({ description: USUARIO.SWAGGER.EMAIL })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    email: true,
    label: 'E-mail',
    gender: 'm',
  })
  email!: string;
}
