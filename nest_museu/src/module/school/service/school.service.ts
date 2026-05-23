import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../../commons/entities/base.service';
import PostgresErrorCode from '../../../commons/enum/postgres-error-code.enum';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { NegocioException } from '../../../commons/exceptions/error/negocio.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { SCHOOL } from '../constants/school.constants';
import { SchoolConverter } from '../dto/converter/school.converter';
import { SchoolRequest } from '../dto/request/school.request';
import { SchoolResponse } from '../dto/response/school.response';
import { School } from '../entities/school.entity';

@Injectable()
export class SchoolService extends BaseService<School> {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
    private readonly dataSource: DataSource,
  ) {
    super(schoolRepository);
  }

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<SchoolResponse>> {
    const fieldsSchool = Object.values(SCHOOL.FIELDS);
    const pageable = new Pageable(page, pageSize, field, order, fieldsSchool);

    try {
      const query = this.schoolRepository
        .createQueryBuilder(SCHOOL.ENTITY)
        .where(`${SCHOOL.ENTITY}.deleted_at IS NULL`);

      if (search) {
        // Busca por nome ou CNPJ
        query.andWhere(
          `(${SCHOOL.ENTITY}.name LIKE :search OR ${SCHOOL.ENTITY}.cnpj LIKE :search)`,
          { search: `%${search}%` },
        );
      }

      const [schools, totalElements] = await query
        .orderBy(`${SCHOOL.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit)
        .getManyAndCount();

      const listaSchools = SchoolConverter.toListSchoolResponse(schools);

      return Page.of(listaSchools, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        SCHOOL.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<SchoolResponse> {
    const school = await this.buscarPorId(id);

    if (!school) {
      throw new EntityNotFoundException(
        SCHOOL.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return SchoolConverter.toSchoolResponse(school);
  }

  async salvar(schoolRequest: SchoolRequest): Promise<SchoolResponse> {
    try {
      const novaEscola = SchoolConverter.toSchool(schoolRequest);
      const escolaSalva = await this.schoolRepository.save(novaEscola);

      return SchoolConverter.toSchoolResponse(escolaSalva);
    } catch (error: any) {
      // Tratamento para violação de unicidade (CNPJ)
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new NegocioException({
          message: 'O CNPJ informado já está cadastrado no sistema.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      // Erro genérico do servidor (Padrão do projeto)
      throw new ServerErrorExceptions(
        SCHOOL.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    schoolRequest: SchoolRequest,
  ): Promise<SchoolResponse> {
    const escolaCadastrada = await this.schoolRepository.findOne({
      where: { idSchool: id },
    });

    if (!escolaCadastrada) {
      throw new EntityNotFoundException(
        SCHOOL.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = SchoolConverter.toSchool(schoolRequest);
      Object.assign(escolaCadastrada, dadosNovos);

      const escolaAtualizada =
        await this.schoolRepository.save(escolaCadastrada);

      return SchoolConverter.toSchoolResponse(escolaAtualizada);
    } catch (error: any) {
      if (error.code === PostgresErrorCode.UniqueViolation) {
        throw new NegocioException({
          message: 'O CNPJ informado já está cadastrado no sistema.',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      throw new ServerErrorExceptions(
        SCHOOL.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    const school = await this.schoolRepository.findOne({
      where: { idSchool: id },
    });

    if (!school) {
      throw new EntityNotFoundException(
        SCHOOL.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      await this.schoolRepository.softRemove(school);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        SCHOOL.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<School | null> {
    try {
      return await this.schoolRepository
        .createQueryBuilder(SCHOOL.ENTITY)
        .leftJoinAndSelect(
          `${SCHOOL.ENTITY}.representatives`,
          'representatives',
        )
        .where(`${SCHOOL.ENTITY}.idSchool = :id`, { id })
        .getOne();
    } catch (error: any) {
      throw new ServerErrorExceptions(
        SCHOOL.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
