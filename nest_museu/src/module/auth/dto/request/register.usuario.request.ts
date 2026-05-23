import { ApiProperty } from '@nestjs/swagger';
import { MatchField } from '../../../../commons/decorators/validation/match.decorators';
import { Password } from '../../../../commons/decorators/validation/password.decorators';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { USUARIO } from '../../../usuario/constants/usuario.constantes';

export class RegisterUsuarioRequest {
  @ApiProperty({ description: USUARIO.SWAGGER.FIRSTNAME })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'Primeiro nome',
    gender: 'm',
  })
  firstName!: string;

  @ApiProperty({ description: USUARIO.SWAGGER.LASTNAME })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'Último nome',
    gender: 'm',
  })
  lastName!: string;

  @ApiProperty({ description: USUARIO.SWAGGER.USERNAME })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    email: true,
    label: 'Nome do usuário',
    gender: 'm',
  })
  username!: string;

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
    label: 'Confirmação de Senha',
    gender: 'f',
  })
  @Password()
  @MatchField('password', {
    required: true,
    label: 'Confirmação de Senha',
    gender: 'f',
  })
  confirmPassword!: string;

  constructor(data: Partial<RegisterUsuarioRequest> = {}) {
    Object.assign(this, data);
  }
}
