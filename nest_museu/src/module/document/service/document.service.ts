import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import { Document } from '../entities/document.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { DocumentResponse } from '../dto/response/document.response';
import { DOCUMENT, fieldsDocument } from '../constants/document.constants';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { DocumentConverter } from '../dto/converter/document.converter';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { DocumentRequest } from '../dto/request/document.request';
import { ConflictException } from '../../../commons/exceptions/error/conflict.exception';

export class DocumentService extends BaseService<Document> {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    super(documentRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<DocumentResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsDocument);

    try {
      const query = this.documentRepository
        .createQueryBuilder(DOCUMENT.ENTITY)
        .leftJoinAndSelect(`${DOCUMENT.ENTITY}.print`, 'print');

      if (search) {
        query.andWhere(`${DOCUMENT.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const documents = await query
        .orderBy(`${DOCUMENT.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getMany();

      const totalElements = await query.getCount();

      const listaDocuments = DocumentConverter.toListDocumentResponse(documents);

      return Page.of(listaDocuments, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }
  }

  async porId(id: number): Promise<DocumentResponse | null> {
    const document = await this.buscarPorId(id);

    if (!document) {
      throw new EntityNotFoundException(DOCUMENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    return DocumentConverter.toDocumentResponse(document);
  }

  async salvar(documentRequest: DocumentRequest): Promise<DocumentResponse> {
    try {
      const documentExistente = await this.documentRepository.findOne({
        where: { idDoc: documentRequest.idDoc },
      });

      if (documentExistente) {
        throw new ConflictException(DOCUMENT.MENSAGEM.ENTIDADE_JA_ATIVA);
      }

      const novoDocument = DocumentConverter.toDocument(documentRequest);
      const documentSalvo = await this.documentRepository.save(novoDocument);

      const documentCompleto = await this.buscarPorId(documentSalvo.idDoc);

      return DocumentConverter.toDocumentResponse(documentCompleto!);
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }
  }

  async atualizar(
    id: number,
    documentRequest: DocumentRequest,
  ): Promise<DocumentResponse | null> {
    const documentCadastrado = await this.buscarPorId(id);

    if (!documentCadastrado) {
      throw new EntityNotFoundException(DOCUMENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      const dadosNovos = DocumentConverter.toDocument(documentRequest);
      Object.assign(documentCadastrado, dadosNovos);

      const documentAtualizado = await this.documentRepository.save(
        documentCadastrado,
      );

      const documentCompleto = await this.buscarPorId(documentAtualizado.idDoc);

      return DocumentConverter.toDocumentResponse(documentCompleto!);
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }
  }

  async excluir(id: number): Promise<void> {
    const document = await this.buscarPorId(id);

    if (!document) {
      throw new EntityNotFoundException(DOCUMENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      await this.documentRepository.softRemove(document);
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }
  }

  async restaurar(id: number): Promise<void> {
    let resultado;
    try {
      resultado = await this.documentRepository.restore({
        idDoc: id,
        deletedAt: Not(IsNull()),
      });
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }

    if (resultado.affected === 0) {
      const existeAtivo = await this.documentRepository.existsBy({
        idDoc: id,
      });

      if (existeAtivo) {
        throw new ConflictException(DOCUMENT.MENSAGEM.ENTIDADE_JA_ATIVA);
      }

      throw new EntityNotFoundException(DOCUMENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }
  }

  async buscarPorId(id: number): Promise<Document | null> {
    try {
      return await this.documentRepository
        .createQueryBuilder(DOCUMENT.ENTITY)
        .leftJoinAndSelect(`${DOCUMENT.ENTITY}.print`, 'print')
        .where(`${DOCUMENT.ENTITY}.idDoc = :id`, { id })
        .getOne();
    } catch (error: any) {
      throw new ServerErrorExceptions(DOCUMENT.MENSAGEM.SERVER_ERROR, error.message);
    }
  }
}
