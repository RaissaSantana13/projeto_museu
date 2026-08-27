import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UsuarioResponse } from '../../../usuario/dto/response/usuario.response';
import { SchoolResponse } from './school.response';

export class SchoolRepresentativeResponse {
  @ApiProperty({ description: 'ID do representante', example: 1 })
  @Expose()
  idRepresentative!: number;

  @ApiProperty({ type: () => SchoolResponse })
  @Expose()
  @Type(() => SchoolResponse)
  school!: SchoolResponse;

  @ApiProperty({ type: () => UsuarioResponse })
  @Expose()
  @Type(() => UsuarioResponse)
  usuario!: UsuarioResponse;

  constructor(data: Partial<SchoolRepresentativeResponse> = {}) {
    Object.assign(this, data);
  }
}