import { ApiProperty } from '@nestjs/swagger';
import { NumberField } from '../../../../commons/decorators/validation/number.decorator';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { ACCOUNT } from '../../constants/accounts.constants';

export class AccountRequest {
  static entityName = ACCOUNT.ALIAS.toLowerCase();
  @ApiProperty({ description: ACCOUNT.SWAGGER.ID_USUARIO, example: '1' })
  @NumberField({ required: true, positive: true, label: 'Id Usuário' })
  usuarioId!: number;

  @ApiProperty({ description: ACCOUNT.SWAGGER.ID_ACCOUNT, example: '1' })
  @TextField({ required: true, min: 1, max: 50, label: 'Provedor OAuth', gender: 'm' })
  providerId!: string;

  @ApiProperty({
    description: ACCOUNT.SWAGGER.PASSWORD,
    example: '******************',
  })
  @TextField({ required: true, min: 6, max: 20, label: 'Senha', gender: 'f' })
  password?: string;

  @ApiProperty({
    description: ACCOUNT.SWAGGER.ACCESS_TOKEN,
    example: 'token',
  })
  @TextField({ required: true, min: 6, max: 100, label: 'Token', gender: 'm' })
  accessToken?: string;

  @ApiProperty({
    description: ACCOUNT.SWAGGER.SCOPE,
    example: 'acesso e permissão do provedor ',
  })
  @TextField({ required: true, min: 6, max: 30, label: 'Escopo', gender: 'f' })
  scope?: string;
}
