import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AUTH } from '../../constants/login.constants';

export class LoginResponse {
  @ApiProperty({ description: AUTH.SWAGGER.ID_USUARIO, example: '1' })
  @Expose()
  idUsuario!: number;
  @Expose()
  @ApiProperty({ description: AUTH.SWAGGER.EMAIL })
  email!: string;

  @Expose()
  @ApiProperty({ description: AUTH.SWAGGER.USERNAME })
  username!: string;

  @Expose()
  @ApiProperty({ description: AUTH.SWAGGER.ROLES })
  roles!: string[];

  constructor(partial: Partial<LoginResponse>) {
    Object.assign(this, partial);
  }
}
