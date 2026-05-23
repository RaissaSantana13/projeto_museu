import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import { Artwork } from '../entities/artwork.entity';
import { Repository } from 'typeorm';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ArtworkResponse } from '../dto/response/artwork.response';
import { ARTWORK, fieldsArtwork } from '../constants/artwork.constants';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { ArtworkConverter } from '../dto/converter/artwork.converter';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ArtworkRequest } from '../dto/request/artwork.request';

export class ArtworkService extends BaseService<Artwork> {
  constructor(
    @InjectRepository(Artwork)
    private readonly artworkRepository: Repository<Artwork>,
  ) {
    super(artworkRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<ArtworkResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsArtwork);

    try {
      const query = this.artworkRepository.createQueryBuilder(ARTWORK.ENTITY);

      if (search) {
        // Filtrar pelo campo selecionado
        query.andWhere(`${ARTWORK.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const artworks = await query
        .orderBy(`${ARTWORK.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getMany();

      const totalElements = await query.getCount();

      const listaArtworks = ArtworkConverter.toListArtworkResponse(artworks);

      return Page.of(listaArtworks, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<ArtworkResponse | null> {
    const artwork = await this.buscarPorId(id);

    if (!artwork) {
      throw new EntityNotFoundException(
        ARTWORK.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return ArtworkConverter.toArtworkResponse(artwork);
  }

  async salvar(artworkRequest: ArtworkRequest): Promise<ArtworkResponse> {
    try {
      const novaArtwork = ArtworkConverter.toArtwork(artworkRequest);
      const artworkSalva = await this.artworkRepository.save(novaArtwork);

      return ArtworkConverter.toArtworkResponse(artworkSalva);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    artworkRequest: ArtworkRequest,
  ): Promise<ArtworkResponse | null> {
    const artworkCadastrada = await this.buscarPorId(id);

    if (!artworkCadastrada) {
      throw new EntityNotFoundException(
        ARTWORK.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = ArtworkConverter.toArtwork(artworkRequest);
      Object.assign(artworkCadastrada, dadosNovos);

      const artworkAtualizada =
        await this.artworkRepository.save(artworkCadastrada);

      return ArtworkConverter.toArtworkResponse(artworkAtualizada);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    const artwork = await this.buscarPorId(id);

    if (!artwork) {
      throw new EntityNotFoundException(
        ARTWORK.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      await this.artworkRepository.softRemove(artwork);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Artwork | null> {
    try {
      return await this.artworkRepository
        .createQueryBuilder(ARTWORK.ENTITY)
        .leftJoinAndSelect(`${ARTWORK.ENTITY}.medias`, 'medias')
        .where(`${ARTWORK.ENTITY}.idArtwork = :id`, { id })
        .getOne();
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
