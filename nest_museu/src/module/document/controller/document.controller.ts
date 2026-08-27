import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BaseController } from '../../../commons/entities/base.controller';
import { DOCUMENT } from '../constants/document.constants';
import { DocumentService } from '../service/document.service';
import { Crud } from '@nestjsx/crud';
import { Document } from '../entities/document.entity';
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { DocumentResponse } from '../dto/response/document.response';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import {
  ApiDeleteDoc,
  ApiGetByIdDoc,
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
  ApiRestoreDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { Request } from 'express';
import { PARAMS } from '../../../commons/constants/param.constants';
import { DocumentRequest } from '../dto/request/document.request';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';

@Crud({
  model: { type: Document },
  dto: {
    create: DocumentRequest,
    update: DocumentRequest,
  },
  routes: {
    exclude: [
      'getManyBase',
      'getOneBase',
      'createOneBase',
      'updateOneBase',
      'replaceOneBase',
      'deleteOneBase',
      'createManyBase',
      'recoverOneBase',
    ],
  },
  ...GLOBAL_CRUD_OPTIONS,
})
@ApiTags(DOCUMENT.ALIAS)
@ApiExtraModels(ApiResponse, DocumentResponse, Link)
@Controller(DOCUMENT.ROTAS.BASE)
export class DocumentController extends BaseController {
  protected readonly entityPath = DOCUMENT.ROTAS.BASE;

  constructor(private readonly documentService: DocumentService) {
    super();
  }

  @Get()
  @ApiGetDoc(DOCUMENT.OPERACAO.LISTAR, DocumentResponse)
  @ApiPaginatedResponse(DocumentResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Page<DocumentResponse>>> {
    const pageController = Number(pagination.page)
      ? Number(pagination.page)
      : PAGINATION.PAGE;
    const pageSizeController = Number(pagination.pageSize)
      ? Number(pagination.pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = pagination.field
      ? pagination.field
      : DOCUMENT.FIELDS.ID_DOC;
    const orderController = pagination.order
      ? pagination.order
      : PAGINATION.ASC;
    const searchController = pagination.search;

    const response = await this.documentService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      searchController,
    );

    return ResponseBuilder.status<Page<DocumentResponse>>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_LISTADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(DOCUMENT.ROTAS.ID)
  @ApiGetByIdDoc(DOCUMENT.OPERACAO.PORID, DocumentResponse)
  async porId(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const response = await this.documentService.porId(id);

    return ResponseBuilder.status<DocumentResponse>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idDoc))
      .build();
  }

  @Post()
  @ApiPostDoc(DOCUMENT.OPERACAO.SALVAR, DocumentRequest, DocumentResponse)
  async salvar(@Body() documentRequest: DocumentRequest, @Req() req: Request) {
    const response = await this.documentService.salvar(documentRequest);

    return ResponseBuilder.status<DocumentResponse>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idDoc))
      .build();
  }

  @Put(DOCUMENT.ROTAS.ID)
  @ApiPutDoc(DOCUMENT.OPERACAO.ATUALIZAR, DocumentRequest, DocumentResponse)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() documentRequest: DocumentRequest,
    @Req() req: Request,
  ) {
    const response = await this.documentService.atualizar(id, documentRequest);

    return ResponseBuilder.status<DocumentResponse>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idDoc))
      .build();
  }

  @Delete(DOCUMENT.ROTAS.ID)
  @ApiDeleteDoc(DOCUMENT.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.documentService.excluir(id);

    return ResponseBuilder.status<DocumentResponse>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }

  @Patch(`${DOCUMENT.ROTAS.ID}/recover`)
  @ApiRestoreDoc(DOCUMENT.OPERACAO.RESTAURAR)
  async restaurar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.documentService.restaurar(id);

    return ResponseBuilder.status<DocumentResponse>(HttpStatus.OK)
      .message(DOCUMENT.MENSAGEM.ENTIDADE_RESTAURADA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
