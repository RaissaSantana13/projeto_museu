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
import { ApiGetDoc } from '../../../commons/decorators/swagger/swagger.decorators';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { SIS_MUSEU } from '../../../commons/enum/sis-museu.enum';
import { HateoasHelper } from '../../../commons/helpers/hateos.helpers';
import { Page } from '../../../commons/pagination/paginacao.sistema';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { ACCOUNT } from '../constants/accounts.constants';
import { AccountRequest } from '../dto/request/account.request';
import { AccountResponse } from '../dto/response/account.response';
import { AccountService } from '../service/account.service';

@ApiTags(ACCOUNT.ALIAS)
@Controller(ACCOUNT.ROTAS.BASE)
export class AccountController {
  private readonly path = `${SIS_MUSEU.ROTA_VERSIONAMENTO}/${ACCOUNT.ROTAS.BASE}`;
  constructor(private readonly accountService: AccountService) {}
  @Get()
  @ApiGetDoc(ACCOUNT.OPERACAO.LISTAR, AccountResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(AccountResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<AccountResponse>>> {
    const pageControler = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : ACCOUNT.FIELDS.ID_ACCOUNT;
    const orderController = order ? order : PAGINATION.ASC;
    const response = await this.accountService.listar(
      pageControler,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );

    return ResponseBuilder.status<Page<AccountResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(ACCOUNT.MENSAGEM.ENITDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.colleCtionsLinks(req, response))
      .build();
  }

  @Get(ACCOUNT.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.accountService.porId(id);
    return ResponseBuilder.status<AccountResponse>(HttpStatus.OK)
      .message(ACCOUNT.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.links(response?.idAccount))
      .build();
  }

  @Post()
  async salvar(@Body() accountRequest: AccountRequest, @Req() req: Request) {
    const response = await this.accountService.salvar(accountRequest);
    return ResponseBuilder.status<AccountResponse>(HttpStatus.OK)
      .message(ACCOUNT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.links())
      .build();
  }

  @Put(ACCOUNT.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() accountRequest: AccountRequest,
    @Req() req: Request,
  ) {
    const response = await this.accountService.atualizar(id, accountRequest);
    return ResponseBuilder.status<AccountResponse>(HttpStatus.OK)
      .message(ACCOUNT.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.links(response?.idAccount))
      .build();
  }

  @Delete(ACCOUNT.ROTAS.ID)
  excluir(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    this.accountService.excluir(id);
    return ResponseBuilder.status<AccountResponse>(HttpStatus.OK)
      .message(ACCOUNT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.links())
      .build();
  }

  private links(id?: number | string): Record<string, Link> {
    const resourceLinks = HateoasHelper.generateResourceLinks(this.path);
    return resourceLinks;
  }

  private colleCtionsLinks(
    req: Request,
    page: Page<any>,
  ): Record<string, Link> {
    const metadata = {
      page: page.page,
      pageSize: page.pageSize,
      totalPages: page.totalPages,
      totalElements: page.totalElements,
    };
    const resourceLinks = HateoasHelper.generateCollectionLinks(
      req,
      metadata,
      this.path,
    );
    return resourceLinks;
  }
}

/*

  controller - criar a rota do recurso - account. define o prefixo.

  Get() - mapear para /account - listar tudo.
  Get('id') - mapear para /account/id - listar um objeto específico

  Post() - criar o objeto account na rota /account
  Put('id') - atualizar o account na rota /account/id
  Patch()

  @delete('id') excluir o objeto usuário na rota /account/id

*/
