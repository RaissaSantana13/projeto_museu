import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PRINT } from '../../constants/print.constants';
import { Type } from 'class-transformer';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';

export class PrintRequest {
  static entityName = PRINT.ALIAS.toLowerCase();

  @ApiProperty({ description: PRINT.SWAGGER.ID_PRINT, example: 1 })
  @Type(() => Number)
  @IsOptional()
  idPrint?: number;

  @ApiProperty({
    description: PRINT.SWAGGER.TITLE,
    example: 'Planta baixa do Museu - 1920',
  })
  @TextField({
    required: true,
    min: 1,
    max: 255,
    label: 'Título',
    gender: 'm',
  })
  title!: string;

  @ApiProperty({
    description: PRINT.SWAGGER.DESCRIPTION,
    example: 'Reprodução impressa da planta original do edifício sede',
  })
  @TextField({
    required: false,
    label: 'Descrição',
    gender: 'f',
  })
  description?: string;

  @ApiProperty({
    description: PRINT.SWAGGER.URL_PRINT,
    example: 'https://museu.exemplo.com/arquivos/prints/planta-1920.pdf',
  })
  @TextField({
    required: false,
    min: 1,
    label: 'URL do Arquivo',
    gender: 'f',
  })
  urlPrint?: string;

  constructor(data: Partial<PrintRequest> = {}) {
    Object.assign(this, data);
  }
}
