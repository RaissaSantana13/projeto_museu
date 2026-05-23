import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PARAMS } from '../../../commons/constants/param.constants';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import { ApiPaginationQuery } from '../../../commons/decorators/swagger/api-pagination-query.decorator';
import { ApiGetDoc } from '../../../commons/decorators/swagger/swagger.decorator';
import { BaseController } from '../../../commons/entities/base.controller';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import { ApiResponse } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { RESOURCES } from '../constants/resources.constants';
import { ResourcesRequest } from '../dto/request/resources.request';
import { ResourcesResponse } from '../dto/response/resources.response';
import { ResourcesService } from '../service/resources.service';

@ApiTags(RESOURCES.ALIAS)
@Controller(RESOURCES.ROTAS.BASE)
export class ResourcesController extends BaseController {
  protected readonly entityPath = RESOURCES.ROTAS.BASE;
  constructor(private readonly resourcesService: ResourcesService) {
    super();
  }
  @Get()
  @ApiGetDoc(RESOURCES.OPERACAO.LISTAR, ResourcesResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(ResourcesResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Page<ResourcesResponse>>> {
    const response = await this.resourcesService.listar(pagination);

    return ResponseBuilder.status<Page<ResourcesResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(RESOURCES.MENSAGEM.ENTIDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(RESOURCES.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.resourcesService.porId(id);
    return ResponseBuilder.status<ResourcesResponse>(HttpStatus.OK)
      .message(RESOURCES.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idResources))
      .build();
  }

  @Post()
  async salvar(
    @Body() resourcesRequest: ResourcesRequest,
    @Req() req: Request,
  ) {
    const response = await this.resourcesService.salvar(resourcesRequest);
    return ResponseBuilder.status<ResourcesResponse>(HttpStatus.OK)
      .message(RESOURCES.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @Put(RESOURCES.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() resourcesRequest: ResourcesRequest,
    @Req() req: Request,
  ) {
    const response = await this.resourcesService.atualizar(
      id,
      resourcesRequest,
    );
    return ResponseBuilder.status<ResourcesResponse>(HttpStatus.OK)
      .message(RESOURCES.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idResources))
      .build();
  }

  @Delete(RESOURCES.ROTAS.ID)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.resourcesService.excluir(id);
    return ResponseBuilder.status<ResourcesResponse>(HttpStatus.OK)
      .message(RESOURCES.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @Get('matriz/:roleId')
  @ApiGetDoc(RESOURCES.OPERACAO.LISTAR, ResourcesResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(ResourcesResponse)
  async listarMatriz(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
    @Param('roleId') roleId: number,
  ): Promise<ApiResponse<Page<ResourcesResponse>>> {
    const response = await this.resourcesService.listarMatriz(
      pagination,
      roleId,
    );

    return ResponseBuilder.status<Page<ResourcesResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(RESOURCES.MENSAGEM.ENTIDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }
}

/*

  controller - criar a rota do recurso - resources. define o prefixo.

  Get() - mapear para /resources - listar tudo.
  Get('id') - mapear para /resources/id - listar um objeto específico

  Post() - criar o objeto resources na rota /resources
  Put('id') - atualizar o resources na rota /resources/id
  Patch()

  @delete('id') excluir o objeto usuário na rota /resources/id

*/
