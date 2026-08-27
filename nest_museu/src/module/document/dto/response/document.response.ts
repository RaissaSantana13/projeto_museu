import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { DOCUMENT } from '../../constants/document.constants';
import { Expose } from 'class-transformer';

export class DocumentResponse {
  @ApiProperty({ description: DOCUMENT.SWAGGER.ID_DOC, example: 1 })
  @Expose()
  idDoc!: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.TITLE,
    example: 'Carta de fundação do museu',
  })
  @Expose()
  title!: string;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.ORIGIN,
    example: 'Arquivo Histórico Municipal',
  })
  @Expose()
  origin!: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.CREATION_YEAR, example: 1920 })
  @Expose()
  creationYear?: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.DESCRIPTION,
    example: 'Documento original assinado pelos fundadores',
  })
  @Expose()
  description?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.DIMENSIONS, example: '30x21cm' })
  @Expose()
  dimensions?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.TYPE, example: 'Carta' })
  @Expose()
  type?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.CATEGORY, example: 'Institucional' })
  @Expose()
  category?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.LOCATION, example: 'Sala de Arquivos' })
  @Expose()
  location?: string;

  @ApiProperty({ description: DOCUMENT.SWAGGER.ID_PRINT, example: 1 })
  @Expose()
  idPrint?: number;

  @ApiProperty({
    description: DOCUMENT.SWAGGER.STATUS,
    example: DOCUMENT.STATUS_DEFAULT,
  })
  @Expose()
  status!: string;

  constructor(data: Partial<DocumentResponse> = {}) {
    Object.assign(this, data);
  }
}
