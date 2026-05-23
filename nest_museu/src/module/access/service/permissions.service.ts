import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import {
  fieldsPermission,
  PERMISSIONS,
} from '../constants/permissions.constants';
import { PermissionsRequest } from '../dto/request/permissions.request';
import { PermissionsResponse } from '../dto/response/permissions.response';
import { Permissions } from '../entities/permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private permissionsRepository: Repository<Permissions>,
    private readonly dataSource: DataSource,
  ) {}

  async listar(pagination: PaginationDto): Promise<Page<PermissionsResponse>> {
    const {
      page,
      pageSize,
      field = PERMISSIONS.FIELDS.ID_PERMISSIONS,
      order,
      search,
    } = pagination;
    const pageable = new Pageable(
      page,
      pageSize,
      field,
      order,
      fieldsPermission,
    );
    try {
      const query = this.permissionsRepository
        .createQueryBuilder(PERMISSIONS.ENTITY)
        .leftJoinAndSelect(`${PERMISSIONS.ENTITY}.role`, 'role')
        .leftJoinAndSelect(`${PERMISSIONS.ENTITY}.resource`, 'resource')
        .orderBy(`${PERMISSIONS.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${PERMISSIONS.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [permissions, totalElements] = await query.getManyAndCount();

      //const listaPermissions = permissions.map(
      //  (permission) => new PermissionsResponse(permission),
      //);

      const listaPermissions = GenericConverter.toListResponse(
        PermissionsResponse,
        permissions,
      );

      return Page.of(listaPermissions, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(error);
    }
  }

  async porId(id: number): Promise<PermissionsResponse | null> {
    const permissions = await this.buscarPorId(id);

    console.log(permissions);

    if (!permissions) {
      throw new EntityNotFoundException(
        PERMISSIONS.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return GenericConverter.toResponse(PermissionsResponse, permissions);
  }

  async salvar(
    permissionsRequest: PermissionsRequest,
  ): Promise<PermissionsResponse> {
    try {
      const novoPermissions = GenericConverter.toEntity(
        Permissions,
        permissionsRequest,
      );

      const permissionsSalvo =
        await this.permissionsRepository.save(novoPermissions);

      return GenericConverter.toResponse(PermissionsResponse, permissionsSalvo);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PERMISSIONS.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    permissionsRequest: PermissionsRequest,
  ): Promise<PermissionsResponse | null> {
    const permissionsCadastrado = await this.buscarPorId(id);

    if (!permissionsCadastrado) {
      throw new EntityNotFoundException(
        PERMISSIONS.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = GenericConverter.toEntity(
        Permissions,
        permissionsRequest,
      );
      const permissionsParaSalvar = Object.assign(
        permissionsCadastrado,
        dadosNovos,
      );
      const permissionsExistente = await this.permissionsRepository.save(
        permissionsParaSalvar,
      );

      return GenericConverter.toResponse(
        PermissionsResponse,
        permissionsExistente,
      );
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PERMISSIONS.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const permissions = await this.buscarPorId(id);

      if (!permissions) {
        throw new EntityNotFoundException(
          PERMISSIONS.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.permissionsRepository.remove(permissions);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PERMISSIONS.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Permissions> {
    try {
      const permissions = await this.permissionsRepository
        .createQueryBuilder(PERMISSIONS.ENTITY)
        .leftJoinAndSelect(`${PERMISSIONS.ENTITY}.role`, 'role')
        .leftJoinAndSelect(`${PERMISSIONS.ENTITY}.resource`, 'resource')
        .where(`${PERMISSIONS.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!permissions) {
        throw new EntityNotFoundException(
          PERMISSIONS.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return permissions;
    } catch (error: any) {
      throw new ServerErrorExceptions(error.message);
    }
  }

  async syncPermissions(
    roleId: number,
    permissionRequest: PermissionsRequest[],
  ) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        await manager.delete(Permissions, { role: { idRoles: roleId } });
        if (permissionRequest.length > 0) {
          const entities = permissionRequest.map((permissions) =>
            manager.create(Permissions, permissions),
          );
          await manager.save(entities);
        }
      });
    } catch (error: any) {
      throw new ServerErrorExceptions(
        PERMISSIONS.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }
}
