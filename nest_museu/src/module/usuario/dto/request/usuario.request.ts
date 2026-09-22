import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Password } from '../../../../commons/decorators/validation/password.decorator';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { USUARIO } from '../../constants/usuario.constants';
import { MatchField } from '../../../../commons/decorators/validation/match.decorator';

export class UsuarioRequest {
  static entityName = USUARIO.ALIAS.toLowerCase();

  @ApiProperty({
    description: USUARIO.SWAGGER.FIRSTNAME,
    example: 'Antônio',
  })
  @TextField({
    required: true,
    min: 1,
    max: 100,
    label: 'Primeiro Nome',
    gender: 'm',
  })
  firstName!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.LASTNAME,
    example: 'Silva',
  })
  @TextField({
    required: true,
    min: 1,
    max: 100,
    label: 'Último Nome',
    gender: 'm',
  })
  lastName!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.USERNAME,
    example: 'Antônio da Silva',
  })
  @TextField({ required: true, min: 6, max: 100, label: 'Nome', gender: 'm' })
  username!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.EMAIL,
    example: 'antonio@dominio.com.br',
  })
  @TextField({
    required: true,
    min: 6,
    max: 100,
    label: 'E-mail',
    gender: 'm',
    email: true,
  })
  email!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.PASSWORD,
    example: 'Teste123!',
  })
  @TextField({ required: true, min: 6, max: 20, label: 'Senha', gender: 'f' })
  @Password()
  password!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.CONFIRM_PASSWORD,
    example: 'Teste123!',
  })
  @TextField({
    required: true,
    min: 6,
    max: 20,
    label: 'Confirme a Senha',
    gender: 'f',
  })
  @Password()
  @MatchField('password', {
    required: true,
    label: 'Confirme a Senha',
    gender: 'f',
  })
  confirmPassword!: string;

  @ApiProperty({
    description: USUARIO.SWAGGER.ROLE,
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  roleIds!: number[];

  @ApiProperty({ description: USUARIO.SWAGGER.IMAGE_PATH })
  @IsOptional()
  @IsString()
  imagePath?: string;

  @ApiProperty({ description: USUARIO.SWAGGER.ACTIVE })
  @IsBoolean()
  active: boolean = false;

  constructor(data: Partial<UsuarioRequest> = {}) {
    Object.assign(this, data);
  }
}
