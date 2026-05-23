import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIP, IsOptional, IsString } from 'class-validator';
import { NumberField } from '../../../../commons/decorators/validation/number.decorators';
import { SESSION } from '../../constants/session.constants';

export class SessionRequest {
  static entityName = SESSION.ALIAS.toLowerCase();
  @ApiProperty({ description: SESSION.SWAGGER.ID_USUARIO, example: '1' })
  @Type(() => Number)
  @NumberField({ required: true, positive: true, label: 'Id Usuário' })
  usuarioId!: number;

  @IsIP()
  @ApiProperty({
    description: SESSION.SWAGGER.IP_ADDRESS,
    example: '192.168.0.1',
  })
  ipAddress?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: SESSION.SWAGGER.USER_AGENT,
    example: 'Acesso do provider',
  })
  userAgent?: string;
}
