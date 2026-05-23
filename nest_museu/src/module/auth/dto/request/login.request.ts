import { ApiProperty } from '@nestjs/swagger';
import { Password } from '../../../../commons/decorators/validation/password.decorators';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { AUTH } from '../../constants/login.constants';

export class LoginRequest {
  static entityName = AUTH.ALIAS.toLowerCase();
  @ApiProperty({ description: AUTH.SWAGGER.EMAIL })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'E-mail',
    gender: 'm',
    email: true,
  })
  email!: string;

  @ApiProperty({ description: AUTH.SWAGGER.PASSWORD })
  @TextField({ required: true, min: 6, max: 20, label: 'Senha', gender: 'f' })
  @Password()
  senha!: string;

  constructor(partial: Partial<LoginRequest>) {
    Object.assign(this, partial);
  }
}
