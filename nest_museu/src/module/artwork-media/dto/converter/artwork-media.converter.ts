import { plainToInstance } from 'class-transformer';
import { ArtworkMedia } from '../../entities/artwork-media.entity';
import { ArtworkMediaRequest } from '../request/artwork-media.request';
import { ArtworkMediaResponse } from '../response/artwork-media.response';

export class ArtworkMediaConverter {
  static toArtworkMedia(
    artworkMediaRequest: ArtworkMediaRequest,
  ): ArtworkMedia {
    return plainToInstance(ArtworkMedia, artworkMediaRequest);
  }

  static toArtworkMediaResponse(
    artworkMedia: ArtworkMedia,
  ): ArtworkMediaResponse {
    return plainToInstance(ArtworkMediaResponse, artworkMedia, {
      excludeExtraneousValues: true,
    });
  }

  static toListArtworkMediaResponse(
    listaArtworkMedia: ArtworkMedia[],
  ): ArtworkMediaResponse[] {
    return plainToInstance(ArtworkMediaResponse, listaArtworkMedia, {
      excludeExtraneousValues: true,
    });
  }
}
