import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import { ConflictException } from '../../../commons/exceptions/error/conflict.exception';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { Artwork } from '../../artwork/entities/artwork.entity';
import {
  ARTWORK_MEDIA,
  fieldsArtworkMedia,
} from '../constants/artwork-media.constants';
import { ArtworkMediaConverter } from '../dto/converter/artwork-media.converter';
import { ArtworkMediaRequest } from '../dto/request/artwork-media.request';
import { UploadMediaRequest } from '../dto/request/upload-media.request';
import { ArtworkMediaResponse } from '../dto/response/artwork-media.response';
import { ArtworkMedia } from '../entities/artwork-media.entity';

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
      const artworkExistente =
        artworkMediaRequest.idMedia == null
          ? null
          : await this.artworkMediaRepository.findOne({
              where: { idMedia: artworkMediaRequest.idMedia },
            });

      if (artworkExistente) {
        throw new ConflictException(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_JA_ATIVA);
      }
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
      // A relação carregada não deve sobrescrever a nova chave estrangeira.
      delete (mediaCadastrada as Partial<ArtworkMedia>).artwork;

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
  async restaurar(id: number): Promise<void> {
    let resultado;
    try {
      resultado = await this.artworkMediaRepository.restore({
        idMedia: id,
        deletedAt: Not(IsNull()),
      });
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ARTWORK_MEDIA.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
    // Validar se realmente existia algo deletado com esse id
    if (resultado.affected === 0) {
      // Busca se o id existe, devolve true ou false
      const existeAtivo = await this.artworkMediaRepository.existsBy({
        idMedia: id,
      });

      if (existeAtivo) {
        throw new ConflictException(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_JA_ATIVA);
      }

      throw new EntityNotFoundException(
        ARTWORK_MEDIA.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }
  }
  async uploadMany(
    files: Express.Multer.File[],
    metadata: UploadMediaRequest,
  ): Promise<ArtworkMediaResponse[]> {
    if (!files?.length)
      throw new BadRequestException('Envie pelo menos um arquivo.');
    if (metadata.idArtwork != null) {
      const exists = await this.artworkMediaRepository.manager
        .getRepository(Artwork)
        .existsBy({ idArtwork: metadata.idArtwork });
      if (!exists) throw new BadRequestException('Obra não encontrada.');
    }
    const records = files.map(
      (file) =>
        new ArtworkMedia({
          ...this.fileMetadata(file),
          idArtwork: metadata.idArtwork ?? null,
          mediaType: metadata.mediaType ?? null,
          isMain: metadata.isMain ?? false,
        }),
    );
    // save(array) usa uma transação: o lote inteiro é persistido ou revertido.
    const saved = await this.artworkMediaRepository.save(records);
    return ArtworkMediaConverter.toListArtworkMediaResponse(saved);
  }

  async updateMetadata(
    id: number,
    metadata: UploadMediaRequest,
  ): Promise<ArtworkMediaResponse> {
    const media = await this.buscarPorId(id);
    if (!media)
      throw new EntityNotFoundException(
        ARTWORK_MEDIA.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    if (metadata.idArtwork != null) {
      const exists = await this.artworkMediaRepository.manager
        .getRepository(Artwork)
        .existsBy({ idArtwork: metadata.idArtwork });
      if (!exists) throw new BadRequestException('Obra não encontrada.');
    }
    delete (media as Partial<ArtworkMedia>).artwork;
    for (const key of ['idArtwork', 'mediaType', 'isMain'] as const) {
      if (metadata[key] !== undefined)
        Object.assign(media, { [key]: metadata[key] });
    }
    return ArtworkMediaConverter.toArtworkMediaResponse(
      await this.artworkMediaRepository.save(media),
    );
  }

  private fileMetadata(file: Express.Multer.File): Partial<ArtworkMedia> {
    return {
      url: `/media/files/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: String(file.size),
    };
  }
}
