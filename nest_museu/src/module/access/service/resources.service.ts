import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { ServerErrorExceptions } from '../../../commons/exceptions/error/server-error.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import { resourceFields, RESOURCES } from '../constants/resources.constants';
import { ResourcesRequest } from '../dto/request/resources.request';
import { ResourcesResponse } from '../dto/response/resources.response';
import { Resources } from '../entities/resources.entity';
import { Roles } from '../entities/role.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resources)
    private resourcesRepository: Repository<Resources>,
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async listar(pagination: PaginationDto): Promise<Page<ResourcesResponse>> {
    const {
      page,
      pageSize,
      field = RESOURCES.FIELDS.ID_RESOURCES,
      order,
      search,
    } = pagination;

    const pageable = new Pageable(page, pageSize, field, order, resourceFields);
    try {
      const query = this.resourcesRepository
        .createQueryBuilder(RESOURCES.ENTITY)
        .orderBy(`${RESOURCES.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${RESOURCES.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [resources, totalElements] = await query.getManyAndCount();

      const listaResources = GenericConverter.toListResponse(
        ResourcesResponse,
        resources,
      );

      return Page.of(listaResources, totalElements, pageable);
    } catch (error: any) {
      throw new ServerErrorExceptions(error);
    }
  }

  async porId(id: number): Promise<ResourcesResponse | null> {
    const resources = await this.buscarPorId(id);

    if (!resources) {
      throw new EntityNotFoundException(
        RESOURCES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return GenericConverter.toResponse(ResourcesResponse, resources);
  }

  async salvar(resourcesRequest: ResourcesRequest): Promise<ResourcesResponse> {
    try {
      const novoResources = GenericConverter.toEntity(
        Resources,
        resourcesRequest,
      );

      const resourcesSalvo = await this.resourcesRepository.save(novoResources);

      return GenericConverter.toResponse(ResourcesResponse, resourcesSalvo);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        RESOURCES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async atualizar(
    id: number,
    resourcesRequest: ResourcesRequest,
  ): Promise<ResourcesResponse | null> {
    const resourcesCadastrado = await this.buscarPorId(id);

    if (!resourcesCadastrado) {
      throw new EntityNotFoundException(
        RESOURCES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = GenericConverter.toEntity(Resources, resourcesRequest);
      const resourcesParaSalvar = Object.assign(
        resourcesCadastrado,
        dadosNovos,
      );
      const resourcesExistente =
        await this.resourcesRepository.save(resourcesParaSalvar);

      return GenericConverter.toResponse(ResourcesResponse, resourcesExistente);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        RESOURCES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const resources = await this.buscarPorId(id);

      if (!resources) {
        throw new EntityNotFoundException(
          RESOURCES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.resourcesRepository.remove(resources);
    } catch (error: any) {
      throw new ServerErrorExceptions(
        RESOURCES.MENSAGEM.SERVER_ERROR,
        error.message,
      );
    }
  }

  async buscarPorId(id: number): Promise<Resources> {
    try {
      const resources = await this.resourcesRepository
        .createQueryBuilder(RESOURCES.ENTITY)
        .where(`${RESOURCES.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!resources) {
        throw new EntityNotFoundException(
          RESOURCES.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return resources;
    } catch (error: any) {
      throw new ServerErrorExceptions(error.message);
    }
  }

  async listarMatriz(pagination: PaginationDto, roleId: number) {
    const { page, pageSize, search, field, order } = pagination;
    const pageable = new Pageable(page, pageSize, field, order, resourceFields);

    // 1. Buscamos o nome da Role uma única vez (evita joins repetitivos em cada linha)
    const role = await this.rolesRepository.findOne({
      where: { idRoles: roleId },
    });
    if (!role) throw new EntityNotFoundException('Role não encontrada');

    // 2. QueryBuilder focado em Recursos
    const query = this.resourcesRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect(
        'resource.permissions',
        'permission',
        'permission.roleId = :roleId',
        { roleId },
      )
      .skip(pageable.offset)
      .take(pageable.limit)
      .orderBy(
        `resource.${pageable.field || 'nomeResources'}`,
        pageable.order || 'ASC',
      );

    if (search) {
      query.where('resource.nomeResources ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [resources, totalElements] = await query.getManyAndCount();

    const content = resources.map((res) => ({
      idResources: res.idResources,
      nomeResources: res.nomeResources,
      roleId: role.idRoles,
      nomeRole: role.nomeRoles,
      acoesAtivas: res.permissions.map((p) => p.action),
    }));

    return Page.of(content, totalElements, pageable);
  }
}
