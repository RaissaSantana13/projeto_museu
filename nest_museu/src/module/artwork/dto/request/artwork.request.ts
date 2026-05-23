import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { ARTWORK } from '../../constants/artwork.constants';
import { Type } from 'class-transformer';
import { ArtworkStatusEnum } from '../../../../commons/enum/artwork-status.enum';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { DateField } from '../../../../commons/decorators/validation/date.decorator';
import { NumberField } from '../../../../commons/decorators/validation/number.decorator';

export class ArtworkRequest {
  static entityName = ARTWORK.ALIAS.toLowerCase();

  @ApiProperty({ description: ARTWORK.SWAGGER.ID_ARTWORK, example: 1 })
  @Type(() => Number)
  @IsOptional()
  idArtwork?: number;

  @ApiProperty({ description: ARTWORK.SWAGGER.TITLE, example: 'Mona Lisa' })
  @TextField({
    required: true,
    min: 1,
    max: 255,
    label: 'Título',
    gender: 'm',
  })
  title!: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.TYPE, example: 'Pintura' })
  @TextField({
    required: true,
    min: 1,
    max: 100,
    label: 'Tipo',
    gender: 'm',
  })
  type!: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ARTIST_NAME,
    example: 'Leonardo da Vinci',
  })
  @TextField({
    required: false,
    min: 1,
    max: 255,
    label: 'Nome do Artista',
    gender: 'm',
  })
  artistName!: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.CREATION_YEAR, example: 1503 })
  @NumberField({
    required: false,
    label: 'Ano de Criação',
    gender: 'm',
  })
  creationYear?: number;

  @ApiProperty({
    description: ARTWORK.SWAGGER.DESCRIPTION,
    example: 'Obra mais notável e conhecida do artista',
  })
  @TextField({
    required: false,
    label: 'Descrição',
    gender: 'f',
  })
  description?: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.TECHNIQUE,
    example: 'Óleo sobre madeira de álamo',
  })
  @TextField({
    required: false,
    min: 1,
    max: 255,
    label: 'Técnica',
    gender: 'f',
  })
  technique?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.HEIGHT, example: '77.00' })
  @TextField({
    required: false,
    label: 'Altura',
    gender: 'f',
  })
  height?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.WIDTH, example: '53.00' })
  @TextField({
    required: false,
    label: 'Largura',
    gender: 'f',
  })
  width?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.DEPTH, example: '0.00' })
  @TextField({
    required: false,
    label: 'Profundidade',
    gender: 'f',
  })
  depth?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.DIMENSION_UNIT, example: 'cm' })
  @TextField({
    required: true,
    min: 1,
    max: 10,
    label: 'Unidade de Medida',
    gender: 'f',
  })
  dimensionUnit!: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ACQUISITION_DATE,
    example: '2026-05-23',
  })
  @DateField({
    required: false,
    label: 'Data de Aquisição',
    gender: 'f',
  })
  acquisitionDate?: Date;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ACQUISITION_METHOD,
    example: 'Doação',
  })
  @TextField({
    required: false,
    min: 1,
    max: 100,
    label: 'Forma de Aquisição',
    gender: 'f',
  })
  acquisitionMethod?: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.STATUS,
    enum: ArtworkStatusEnum,
    example: ArtworkStatusEnum.EM_EXIBICAO,
  })
  @TextField({
    required: true,
    label: 'Status',
    gender: 'm',
  })
  status!: ArtworkStatusEnum;

  @ApiProperty({
    description: ARTWORK.SWAGGER.LOCATION,
    example: 'Sala 03',
  })
  @TextField({
    required: false,
    min: 1,
    max: 255,
    label: 'Localização',
    gender: 'f',
  })
  location?: string;

  constructor(data: Partial<ArtworkRequest> = {}) {
    Object.assign(this, data);
  }
}
