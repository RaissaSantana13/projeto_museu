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
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
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
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { USUARIO } from '../constants/usuario.constantes';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioService } from '../service/usuario.service';

@Crud({
  model: { type: Usuario },
  ...GLOBAL_CRUD_OPTIONS,
})
@ApiTags(USUARIO.ALIAS)
@ApiExtraModels(ApiResponse, UsuarioResponse, Link)
@Controller(USUARIO.ROTAS.BASE)
export class UsuarioController extends BaseController {
  protected readonly entityPath = USUARIO.ROTAS.BASE;
  constructor(private readonly usuarioService: UsuarioService) {
    super();
  }
  @Get()
  @ApiGetDoc(USUARIO.OPERACAO.LISTAR, UsuarioResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(UsuarioResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<UsuarioResponse>>> {
    const pageControler = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : USUARIO.FIELDS.ID_USUARIO;
    const orderController = order ? order : PAGINATION.ASC;
    const response = await this.usuarioService.listar(
      pageControler,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );

    return ResponseBuilder.status<Page<UsuarioResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(USUARIO.MENSAGEM.ENITDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(USUARIO.ROTAS.ID)
  @ApiGetDoc(USUARIO.OPERACAO.PORID, UsuarioResponse)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.usuarioService.porId(id);
    return ResponseBuilder.status<UsuarioResponse>(HttpStatus.OK)
      .message(USUARIO.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idUsuario))
      .build();
  }

  @Post()
  @ApiPostDoc(USUARIO.OPERACAO.SALVAR, UsuarioRequest, UsuarioResponse)
  async salvar(@Body() usuarioRequest: UsuarioRequest, @Req() req: Request) {
    const response = await this.usuarioService.salvar(usuarioRequest);
    return ResponseBuilder.status<UsuarioResponse>(HttpStatus.OK)
      .message(USUARIO.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }

  @Put(USUARIO.ROTAS.ID)
  @ApiPutDoc(USUARIO.OPERACAO.ATUALIZAR, UsuarioRequest, UsuarioResponse)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() usuarioRequest: UsuarioRequest,
    @Req() req: Request,
  ) {
    const response = await this.usuarioService.atualizar(id, usuarioRequest);
    return ResponseBuilder.status<UsuarioResponse>(HttpStatus.OK)
      .message(USUARIO.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idUsuario))
      .build();
  }

  @Delete(USUARIO.ROTAS.ID)
  @ApiDeleteDoc(USUARIO.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.usuarioService.excluir(id);
    return ResponseBuilder.status<UsuarioResponse>(HttpStatus.OK)
      .message(USUARIO.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }
}

/*

  controller - criar a rota do recurso - usuario. define o prefixo.

  Get() - mapear para /usuario - listar tudo.
  Get('id') - mapear para /usuario/id - listar um objeto específico

  Post() - criar o objeto usuario na rota /usuario
  Put('id') - atualizar o usuario na rota /usuario/id
  Patch()

  @delete('id') excluir o objeto usuário na rota /usuario/id

*/
