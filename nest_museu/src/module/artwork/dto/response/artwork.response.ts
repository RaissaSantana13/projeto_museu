import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { ARTWORK } from '../../constants/artwork.constants';
import { Expose } from 'class-transformer';
import { ArtworkStatusEnum } from '../../../../commons/enum/artwork-status.enum';

export class ArtworkResponse {
  @ApiProperty({
    description: ARTWORK.SWAGGER.ID_ARTWORK,
    example: 1,
  })
  @Expose()
  idArtwork!: number;

  @ApiProperty({
    description: ARTWORK.SWAGGER.TITLE,
    example: 'Mona Lisa',
  })
  @Expose()
  title!: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.TYPE, example: 'Pintura' })
  @Expose()
  type!: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ARTIST_NAME,
    example: 'Leonardo da Vinci',
  })
  @Expose()
  artistName!: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.CREATION_YEAR, example: 1503 })
  @Expose()
  creationYear?: number;

  @ApiProperty({
    description: ARTWORK.SWAGGER.DESCRIPTION,
    example: 'Obra mais notável e conhecida do artista',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.TECHNIQUE,
    example: 'Óleo sobre madeira de álamo',
  })
  @Expose()
  technique?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.HEIGHT, example: '77.00' })
  @Expose()
  height?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.WIDTH, example: '53.00' })
  @Expose()
  width?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.DEPTH, example: '0.00' })
  @Expose()
  depth?: string;

  @ApiProperty({ description: ARTWORK.SWAGGER.DIMENSION_UNIT, example: 'cm' })
  @Expose()
  dimensionUnit!: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ACQUISITION_DATE,
    example: '2026-05-23',
  })
  @Expose()
  acquisitionDate?: Date;

  @ApiProperty({
    description: ARTWORK.SWAGGER.ACQUISITION_METHOD,
    example: 'Doação',
  })
  @Expose()
  acquisitionMethod?: string;

  @ApiProperty({
    description: ARTWORK.SWAGGER.STATUS,
    enum: ArtworkStatusEnum,
    example: ArtworkStatusEnum.EM_EXIBICAO,
  })
  @Expose()
  status!: ArtworkStatusEnum;

  @ApiProperty({ description: ARTWORK.SWAGGER.LOCATION, example: 'Sala 03' })
  @Expose()
  location?: string;

  constructor(data: Partial<ArtworkResponse> = {}) {
    Object.assign(this, data);
  }
}
