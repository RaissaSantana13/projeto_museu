import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import { ArtworkMedia } from '../entities/artwork-media.entity';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import {
  fieldsArtworkMedia,
  ARTWORK_MEDIA,
} from '../constants/artwork-media.constants';
import { ArtworkMediaConverter } from '../dto/converter/artwork-media.converter';
import { ArtworkMediaRequest } from '../dto/request/artwork-media.request';
import { ArtworkMediaResponse } from '../dto/response/artwork-media.response';

export class ArtworkMediaService extends BaseService<ArtworkMedia> {
  constructor(
    @InjectRepository(ArtworkMedia)
    private readonly artworkMediaRepository: Repository<ArtworkMedia>,
  ) {
    super(artworkMediaRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<ArtworkMediaResponse>> {
    const pageable = new Pageable(
      page,
      pageSize,
      field,
      order,
      fieldsArtworkMedia,
    );

    try {
      const query = this.artworkMediaRepository.createQueryBuilder(
        ARTWORK_MEDIA.ENTITY,
      );

      if (search) {
        // Filtrar pelo campo selecionado (ex: buscar por tipo de arquivo ou URL)
        query.andWhere(`${ARTWORK_MEDIA.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const medias = await query
        .orderBy(`${ARTWORK_MEDIA.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getMany();

      const totalElements = await query.getCount();

      const listaMedias =
        ArtworkMediaConverter.toListArtworkMediaResponse(medias);

      return Page.of(listaMedias, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<ArtworkMediaResponse | null> {
    const artworkMedia = await this.buscarPorId(id);

    if (!artworkMedia) {
      throw new EntityNotFoundException(
        ARTWORK_MEDIA.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return ArtworkMediaConverter.toArtworkMediaResponse(artworkMedia);
  }

  async salvar(
    artworkMediaRequest: ArtworkMediaRequest,
  ): Promise<ArtworkMediaResponse> {
    try {
      const novaMedia =
        ArtworkMediaConverter.toArtworkMedia(artworkMediaRequest);
      const mediaSalva = await this.artworkMediaRepository.save(novaMedia);

      return ArtworkMediaConverter.toArtworkMediaResponse(mediaSalva);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    artworkMediaRequest: ArtworkMediaRequest,
  ): Promise<ArtworkMediaResponse | null> {
    const mediaCadastrada = await this.buscarPorId(id);

    if (!mediaCadastrada) {
      throw new EntityNotFoundException(
        ARTWORK_MEDIA.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos =
        ArtworkMediaConverter.toArtworkMedia(artworkMediaRequest);
      Object.assign(mediaCadastrada, dadosNovos);

      const mediaAtualizada =
        await this.artworkMediaRepository.save(mediaCadastrada);

      return ArtworkMediaConverter.toArtworkMediaResponse(mediaAtualizada);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    const media = await this.buscarPorId(id);

    if (!media) {
      throw new EntityNotFoundException(
        ARTWORK_MEDIA.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      await this.artworkMediaRepository.softRemove(media);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<ArtworkMedia | null> {
    try {
      return await this.artworkMediaRepository
        .createQueryBuilder(ARTWORK_MEDIA.ENTITY)
        .leftJoinAndSelect(`${ARTWORK_MEDIA.ENTITY}.artwork`, 'artwork')
        .where(`${ARTWORK_MEDIA.ENTITY}.idMedia = :id`, { id })
        .getOne();
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
