import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ARTWORK_MEDIA } from '../../constants/artwork-media.constants';

export class ArtworkMediaResponse {
  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.ID_MEDIA,
    example: 1,
  })
  @Expose()
  idMedia!: number;

  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.ID_ARTWORK,
    example: 1,
  })
  @Expose()
  idArtwork!: number;

  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.MEDIA_TYPE,
    example: '3d',
  })
  @Expose()
  mediaType!: string;

  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.URL,
    example: 'uploads/artworks/monalisa-3d.obj',
  })
  @Expose()
  url!: string;

  @ApiProperty({
    description: ARTWORK_MEDIA.SWAGGER.IS_MAIN,
    example: true,
  })
  @Expose()
  isMain!: boolean;

  constructor(data: Partial<ArtworkMediaResponse> = {}) {
    Object.assign(this, data);
  }
}
