import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ARTWORK_MEDIA } from '../../constants/artwork-media.constants';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { BooleanField } from '../../../../commons/decorators/validation/boolean.decorator';

export class ArtworkMediaRequest {
  static entityName = ARTWORK_MEDIA.ALIAS.toLowerCase();

  @ApiProperty({ description: ARTWORK_MEDIA.SWAGGER.ID_MEDIA, example: 1 })
  @Type(() => Number)
  @IsOptional()
  idMedia?: number;

  @ApiProperty({ description: ARTWORK_MEDIA.SWAGGER.ID_ARTWORK, example: 1 })
  // Padrão para IDs e chaves estrangeiras (mudar dps?)
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idArtwork!: number;

  @ApiProperty({ description: ARTWORK_MEDIA.SWAGGER.MEDIA_TYPE, example: '3d' })
  @TextField({
    required: true,
    min: 1,
    max: 20,
    label: 'Tipo do Arquivo',
    gender: 'm',
  })
  mediaType!: string;

  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.URL,
    example: 'uploads/artworks/monalisa-3d.obj',
  })
  @TextField({
    required: true,
    label: 'URL',
    gender: 'f',
  })
  url!: string;

  @ApiProperty({ description: ARTWORK_MEDIA.SWAGGER.IS_MAIN, example: true })
  @BooleanField({
    required: true,
    label: 'Mídia Principal',
    gender: 'f',
  })
  isMain!: boolean;

  constructor(data: Partial<ArtworkMediaRequest> = {}) {
    Object.assign(this, data);
  }
}
