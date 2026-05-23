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
import { ROLES } from '../constants/roles.constants';
import { RolesRequest } from '../dto/request/roles.request';
import { RolesResponse } from '../dto/response/roles.response';
import { RolesService } from '../service/roles.service';

@ApiTags(ROLES.ALIAS)
@Controller(ROLES.ROTAS.BASE)
export class RolesController extends BaseController {
  protected readonly entityPath = ROLES.ROTAS.BASE;
  constructor(private readonly rolesService: RolesService) {
    super();
  }
  @Get()
  @ApiGetDoc(ROLES.OPERACAO.LISTAR, RolesResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(RolesResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Page<RolesResponse>>> {
    const response = await this.rolesService.listar(pagination);

    return ResponseBuilder.status<Page<RolesResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(ROLES.MENSAGEM.ENTIDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(ROLES.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.rolesService.porId(id);
    return ResponseBuilder.status<RolesResponse>(HttpStatus.OK)
      .message(ROLES.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idRoles))
      .build();
  }

  @Post()
  async salvar(@Body() rolesRequest: RolesRequest, @Req() req: Request) {
    const response = await this.rolesService.salvar(rolesRequest);
    return ResponseBuilder.status<RolesResponse>(HttpStatus.OK)
      .message(ROLES.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @Put(ROLES.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() rolesRequest: RolesRequest,
    @Req() req: Request,
  ) {
    const response = await this.rolesService.atualizar(id, rolesRequest);
    return ResponseBuilder.status<RolesResponse>(HttpStatus.OK)
      .message(ROLES.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idRoles))
      .build();
  }

  @Delete(ROLES.ROTAS.ID)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.rolesService.excluir(id);
    return ResponseBuilder.status<RolesResponse>(HttpStatus.OK)
      .message(ROLES.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }
}

/*

  controller - criar a rota do recurso - roles. define o prefixo.

  Get() - mapear para /roles - listar tudo.
  Get('id') - mapear para /roles/id - listar um objeto específico

  Post() - criar o objeto roles na rota /roles
  Put('id') - atualizar o roles na rota /roles/id
  Patch()

  @delete('id') excluir o objeto usuário na rota /roles/id

*/
