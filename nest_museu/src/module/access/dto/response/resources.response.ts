import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RESOURCES } from '../../constants/resources.constants';

export class ResourcesResponse {
  @ApiProperty({
    description: RESOURCES.SWAGGER.ID_RESOURCES,
    example: 1,
  })
  @Expose()
  idResources!: number;

  @ApiProperty({
    description: RESOURCES.SWAGGER.NOME_RESOURCES,
    example: 'eventos',
  })
  @Expose()
  nomeResources!: string;

  constructor(data: Partial<ResourcesResponse> = {}) {
    Object.assign(this, data);
  }
}
