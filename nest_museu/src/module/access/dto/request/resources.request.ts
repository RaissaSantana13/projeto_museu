import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { RESOURCES } from '../../constants/resources.constants';

export class ResourcesRequest {
  static entityName = RESOURCES.ALIAS.toLowerCase();
  @ApiProperty({
    description: RESOURCES.SWAGGER.ID_RESOURCES,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  idResources!: number;

  @ApiProperty({
    description: RESOURCES.SWAGGER.NOME_RESOURCES,
    example: 'eventos',
  })
  @TextField({ required: true, min: 8, max: 100, label: 'Nome', gender: 'm' })
  nomeResources!: string;

  constructor(data: Partial<ResourcesRequest> = {}) {
    Object.assign(this, data);
  }
}
