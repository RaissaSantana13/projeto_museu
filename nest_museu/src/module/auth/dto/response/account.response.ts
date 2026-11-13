import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ACCOUNT } from '../../constants/accounts.constants';

export class AccountResponse {
  @ApiProperty({ description: ACCOUNT.SWAGGER.ID_USUARIO, example: '1' })
  @Expose()
  idAccount!: string;

  @ApiProperty({ description: ACCOUNT.SWAGGER.ID_ACCOUNT, example: '1' })
  @Expose()
  providerId!: string;

  @ApiProperty({
    description: ACCOUNT.SWAGGER.SCOPE,
    example: 'acesso e permissão do provedor ',
  })
  @Expose()
  scope?: string;

  @ApiProperty({
    description: ACCOUNT.SWAGGER.ACCESS_TOKEN,
    example: 'token',
  })
  @Expose()
  accessTokenExpiresAt?: Date;

  constructor(partial: Partial<AccountResponse>) {
    Object.assign(this, partial);
  }
}
