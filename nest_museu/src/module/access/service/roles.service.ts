import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EntityNotFoundException } from '../../../commons/excpetions/error/entityNotFound.exceptions';
import { ServerErrorExceptions } from '../../../commons/excpetions/error/server.error.exceptions';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/paginacao.sistema';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import { fieldsRoles, ROLES } from '../constants/roles.constants';
import { RolesRequest } from '../dto/request/roles.request';
import { RolesResponse } from '../dto/response/roles.response';
import { Roles } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async listar(pagination: PaginationDto): Promise<Page<RolesResponse>> {
    const {
      page,
      pageSize,
      field = ROLES.FIELDS.ID_ROLE,
      order,
      search,
    } = pagination;
    const pageable = new Pageable(page, pageSize, field, order, fieldsRoles);
    try {
      const query = this.rolesRepository
        .createQueryBuilder(ROLES.ENTITY)
        .orderBy(`${ROLES.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${ROLES.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [roles, totalElements] = await query.getManyAndCount();

      const listaRoles = GenericConverter.toListResponse(RolesResponse, roles);

      return Page.of(listaRoles, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ROLES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async porId(id: number): Promise<RolesResponse | null> {
    const roles = await this.buscarPorId(id);

    if (!roles) {
      throw new EntityNotFoundException(ROLES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    return GenericConverter.toResponse(RolesResponse, roles);
  }

  async salvar(rolesRequest: RolesRequest): Promise<RolesResponse> {
    try {
      const novaRole = GenericConverter.toEntity(Roles, rolesRequest);

      const rolesSalvo = await this.rolesRepository.save(novaRole);

      return GenericConverter.toResponse(RolesResponse, rolesSalvo);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ROLES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    rolesRequest: RolesRequest,
  ): Promise<RolesResponse | null> {
    const rolesCadastrado = await this.buscarPorId(id);

    if (!rolesCadastrado) {
      throw new EntityNotFoundException(ROLES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      const dadosNovos = GenericConverter.toEntity(Roles, rolesRequest);
      const rolesParaSalvar = Object.assign(rolesCadastrado, dadosNovos);
      const rolesExistente = await this.rolesRepository.save(rolesParaSalvar);

      return GenericConverter.toResponse(RolesResponse, rolesExistente);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ROLES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const roles = await this.buscarPorId(id);

      if (!roles) {
        throw new EntityNotFoundException(
          ROLES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.rolesRepository.remove(roles);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        ROLES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Roles> {
    try {
      const roles = await this.rolesRepository
        .createQueryBuilder(ROLES.ENTITY)
        .where(`${ROLES.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!roles) {
        throw new EntityNotFoundException(
          ROLES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return roles;
    } catch (error: any) {
      throw new ServerErrorExceptions(error.message);
    }
  }
}
