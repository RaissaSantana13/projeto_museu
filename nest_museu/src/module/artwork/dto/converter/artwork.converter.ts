import { plainToInstance } from 'class-transformer';
import { Artwork } from '../../entities/artwork.entity';
import { ArtworkRequest } from '../request/artwork.request';
import { ArtworkResponse } from '../response/artwork.response';

export class ArtworkConverter {
  static toArtwork(artworkRequest: ArtworkRequest): Artwork {
    return plainToInstance(Artwork, artworkRequest);
  }

  static toArtworkResponse(artwork: Artwork): ArtworkResponse {
    return plainToInstance(ArtworkResponse, artwork, {
      excludeExtraneousValues: true,
    });
  }

  static toListArtworkResponse(listaArtwork: Artwork[]): ArtworkResponse[] {
    return plainToInstance(ArtworkResponse, listaArtwork, {
      excludeExtraneousValues: true,
    });
  }
}
