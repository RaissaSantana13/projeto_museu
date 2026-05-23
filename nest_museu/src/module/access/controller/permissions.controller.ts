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
import {
  ApiDeleteDoc,
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { BaseController } from '../../../commons/entities/base.controller';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import { ApiResponse } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { PERMISSIONS } from '../constants/permissions.constants';
import { PermissionsRequest } from '../dto/request/permissions.request';
import { PermissionsResponse } from '../dto/response/permissions.response';
import { PermissionsService } from '../service/permissions.service';

@ApiTags(PERMISSIONS.ALIAS)
@Controller(PERMISSIONS.ROTAS.BASE)
export class PermissionsController extends BaseController {
  protected readonly entityPath = PERMISSIONS.ROTAS.BASE;
  constructor(private readonly permissionsService: PermissionsService) {
    super();
  }
  @Get()
  @ApiGetDoc(PERMISSIONS.OPERACAO.LISTAR, PermissionsResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(PermissionsResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Page<PermissionsResponse>>> {
    const response = await this.permissionsService.listar(pagination);
    return ResponseBuilder.status<Page<PermissionsResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(PERMISSIONS.MENSAGEM.ENTIDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @ApiGetDoc(PERMISSIONS.OPERACAO.PORID, PermissionsResponse)
  @Get(PERMISSIONS.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.permissionsService.porId(id);
    return ResponseBuilder.status<PermissionsResponse>(HttpStatus.OK)
      .message(PERMISSIONS.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idPermissions))
      .build();
  }

  @ApiPostDoc(
    PERMISSIONS.OPERACAO.LISTAR,
    PermissionsRequest,
    PermissionsResponse,
  )
  @Post()
  async salvar(
    @Body() permissionsRequest: PermissionsRequest,
    @Req() req: Request,
  ) {
    const response = await this.permissionsService.salvar(permissionsRequest);
    return ResponseBuilder.status<PermissionsResponse>(HttpStatus.OK)
      .message(PERMISSIONS.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @ApiPutDoc(
    PERMISSIONS.OPERACAO.LISTAR,
    PermissionsRequest,
    PermissionsResponse,
  )
  @Put(PERMISSIONS.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() permissionsRequest: PermissionsRequest,
    @Req() req: Request,
  ) {
    const response = await this.permissionsService.atualizar(
      id,
      permissionsRequest,
    );
    return ResponseBuilder.status<PermissionsResponse>(HttpStatus.OK)
      .message(PERMISSIONS.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idPermissions))
      .build();
  }

  @ApiDeleteDoc(PERMISSIONS.OPERACAO.LISTAR)
  @Delete(PERMISSIONS.ROTAS.ID)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.permissionsService.excluir(id);
    return ResponseBuilder.status<PermissionsResponse>(HttpStatus.OK)
      .message(PERMISSIONS.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @ApiPostDoc(
    PERMISSIONS.OPERACAO.SALVAR,
    PermissionsRequest,
    PermissionsResponse,
  )
  @Post('sync/:roleId')
  async syncPermissions(
    @Param('roleId') roleId: number,
    @Body() permissionsRequest: PermissionsRequest[],
  ) {
    return this.permissionsService.syncPermissions(roleId, permissionsRequest);
  }
}
