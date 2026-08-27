import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { DOCUMENT } from '../../constants/document.constants';
import { Type } from 'class-transformer';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { NumberField } from '../../../../commons/decorators/validation/number.decorator';

export class DocumentRequest {
  static entityName = DOCUMENT.ALIAS.toLowerCase();

  @ApiProperty({ description: DOCUMENT.SWAGGER.ID_DOC, example: 1 })
  @Type(() => Number)
  @IsOptional()
  idDoc?: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.TITLE,
    example: 'Carta de fundação do museu',
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
    description: DOCUMENT.SWAGGER.ORIGIN,
    example: 'Arquivo Histórico Municipal',
  })
  @TextField({
    required: true,
    min: 1,
    max: 255,
    label: 'Origem',
    gender: 'f',
  })
  origin!: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.CREATION_YEAR, example: 1920 })
  @NumberField({
    required: false,
    label: 'Ano de Criação',
    gender: 'm',
  })
  creationYear?: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.DESCRIPTION,
    example: 'Documento original assinado pelos fundadores',
  })
  @TextField({
    required: false,
    label: 'Descrição',
    gender: 'f',
  })
  description?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.DIMENSIONS, example: '30x21cm' })
  @TextField({
    required: false,
    min: 1,
    max: 100,
    label: 'Dimensões',
    gender: 'f',
  })
  dimensions?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.TYPE, example: 'Carta' })
  @TextField({
    required: false,
    min: 1,
    max: 100,
    label: 'Tipo',
    gender: 'm',
  })
  type?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.CATEGORY, example: 'Institucional' })
  @TextField({
    required: false,
    min: 1,
    max: 100,
    label: 'Categoria',
    gender: 'f',
  })
  category?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.LOCATION, example: 'Sala de Arquivos' })
  @TextField({
    required: false,
    min: 1,
    max: 150,
    label: 'Localização',
    gender: 'f',
  })
  location?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.ID_PRINT, example: 1 })
  @NumberField({
    required: false,
    label: 'Material Impresso associado',
    gender: 'm',
  })
  idPrint?: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.STATUS,
    example: DOCUMENT.STATUS_DEFAULT,
  })
  @TextField({
    required: false,
    min: 1,
    max: 50,
    label: 'Status',
    gender: 'm',
  })
  status?: string;

  constructor(data: Partial<DocumentRequest> = {}) {
    Object.assign(this, data);
  }
}
