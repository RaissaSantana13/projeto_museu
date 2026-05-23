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
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { SIS_MUSEU } from '../../../commons/enum/sis-museu.enum';
import { HateoasHelper } from '../../../commons/helpers/hateoas.helpers';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { CONTACT } from '../constants/contact.constantes';
import { ContactRequest } from '../dto/request/contact.request';
import { ContactResponse } from '../dto/response/contact.response';
import { ContactService } from '../service/contact.service';

@ApiTags(CONTACT.ALIAS)
@Controller(CONTACT.ROTAS.BASE)
export class ContactController {
  private readonly path = `${SIS_MUSEU.ROTA_VERSIONAMENTO}/${CONTACT.ROTAS.BASE}`;
  constructor(private readonly contactService: ContactService) {}
  @Get()
  @ApiGetDoc(CONTACT.OPERACAO.LISTAR, ContactResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(ContactResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<ContactResponse>>> {
    const pageControler = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : CONTACT.FIELDS.ID_CONTACT;
    const orderController = order ? order : PAGINATION.ASC;
    const response = await this.contactService.listar(
      pageControler,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );
    return ResponseBuilder.status<Page<ContactResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(CONTACT.MENSAGEM.ENITDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.contactPageLinks(req, response))
      .build();
  }

  @Get(CONTACT.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.contactService.porId(id);
    return ResponseBuilder.status<ContactResponse>(HttpStatus.OK)
      .message(CONTACT.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.contactLinks(response?.idContact))
      .build();
  }

  @Post()
  async salvar(@Body() contactRequest: ContactRequest, @Req() req: Request) {
    const response = await this.contactService.salvar(contactRequest);
    return ResponseBuilder.status<ContactResponse>(HttpStatus.OK)
      .message(CONTACT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.contactLinks())
      .build();
  }

  @Put(CONTACT.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() contactRequest: ContactRequest,
    @Req() req: Request,
  ) {
    const response = await this.contactService.atualizar(id, contactRequest);
    return ResponseBuilder.status<ContactResponse>(HttpStatus.OK)
      .message(CONTACT.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.contactLinks(response?.idContact))
      .build();
  }

  @Delete(CONTACT.ROTAS.ID)
  excluir(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    this.contactService.excluir(id);

    return ResponseBuilder.status<ContactResponse>(HttpStatus.OK)
      .message(CONTACT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.contactLinks())
      .build();
  }

  private contactLinks(id?: number): Record<string, Link> {
    const resourceLinks = HateoasHelper.generateResourceLinks(this.path);
    return resourceLinks;
  }

  private contactPageLinks(
    req: Request,
    page: Page<any>,
  ): Record<string, Link> {
    const paginationLinks = HateoasHelper.generatePaginationLinks(
      req,
      page,
      this.path,
    );
    return paginationLinks;
  }
}
