import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import { Print } from '../entities/print.entity';
import { Repository } from 'typeorm';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PrintResponse } from '../dto/response/print.response';
import { PRINT, fieldsPrint } from '../constants/print.constants';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { PrintConverter } from '../dto/converter/print.converter';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { PrintRequest } from '../dto/request/print.request';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrintService extends BaseService<Print> {
  constructor(
    @InjectRepository(Print)
    private readonly printRepository: Repository<Print>,
  ) {
    super(printRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<PrintResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsPrint);

    try {
      const query = this.printRepository.createQueryBuilder(PRINT.ENTITY);

      if (search) {
        // Filtrar pelo campo selecionado
        query.andWhere(`${PRINT.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const prints = await query
        .orderBy(`${PRINT.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getMany();

      const totalElements = await query.getCount();

      const listaPrints = PrintConverter.toListPrintResponse(prints);

      return Page.of(listaPrints, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PRINT.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<PrintResponse | null> {
    const print = await this.buscarPorId(id);

    if (!print) {
      throw new EntityNotFoundException(PRINT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    return PrintConverter.toPrintResponse(print);
  }

  async salvar(printRequest: PrintRequest): Promise<PrintResponse> {
    try {
      const novoPrint = PrintConverter.toPrint(printRequest);
      const printSalvo = await this.printRepository.save(novoPrint);

      return PrintConverter.toPrintResponse(printSalvo);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PRINT.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    printRequest: PrintRequest,
  ): Promise<PrintResponse | null> {
    const printCadastrado = await this.buscarPorId(id);

    if (!printCadastrado) {
      throw new EntityNotFoundException(PRINT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      const dadosNovos = PrintConverter.toPrint(printRequest);
      Object.assign(printCadastrado, dadosNovos);

      const printAtualizado = await this.printRepository.save(printCadastrado);

      return PrintConverter.toPrintResponse(printAtualizado);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PRINT.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  // A tabela "prints" não possui coluna deleted_at, então a exclusão é definitiva
  // (sem soft delete/restore, diferente de módulos como artwork).
  async excluir(id: number): Promise<void> {
    const print = await this.buscarPorId(id);

    if (!print) {
      throw new EntityNotFoundException(PRINT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      await this.printRepository.remove(print);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PRINT.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Print | null> {
    try {
      return await this.printRepository
        .createQueryBuilder(PRINT.ENTITY)
        .where(`${PRINT.ENTITY}.idPrint = :id`, { id })
        .getOne();
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PRINT.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
