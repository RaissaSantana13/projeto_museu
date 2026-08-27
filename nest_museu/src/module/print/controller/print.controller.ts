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
import { BaseController } from '../../../commons/entities/base.controller';
import { PRINT } from '../constants/print.constants';
import { PrintService } from '../service/print.service';
import { Crud } from '@nestjsx/crud';
import { Print } from '../entities/print.entity';
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PrintResponse } from '../dto/response/print.response';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import {
  ApiDeleteDoc,
  ApiGetByIdDoc,
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { Request } from 'express';
import { PARAMS } from '../../../commons/constants/param.constants';
import { PrintRequest } from '../dto/request/print.request';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';

@Crud({
  model: { type: Print },
  dto: {
    create: PrintRequest,
    update: PrintRequest,
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
@ApiTags(PRINT.ALIAS)
@ApiExtraModels(ApiResponse, PrintResponse, Link)
@Controller(PRINT.ROTAS.BASE)
export class PrintController extends BaseController {
  protected readonly entityPath = PRINT.ROTAS.BASE;

  constructor(private readonly printService: PrintService) {
    super();
  }

  @Get()
  @ApiGetDoc(PRINT.OPERACAO.LISTAR, PrintResponse)
  @ApiPaginatedResponse(PrintResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto, // Recebe o objeto de paginação unificado do commons
  ): Promise<ApiResponse<Page<PrintResponse>>> {
    const pageController = Number(pagination.page)
      ? Number(pagination.page)
      : PAGINATION.PAGE;
    const pageSizeController = Number(pagination.pageSize)
      ? Number(pagination.pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = pagination.field
      ? pagination.field
      : PRINT.FIELDS.ID_PRINT;
    const orderController = pagination.order
      ? pagination.order
      : PAGINATION.ASC;
    const searchController = pagination.search;

    const response = await this.printService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      searchController,
    );

    return ResponseBuilder.status<Page<PrintResponse>>(HttpStatus.OK)
      .message(PRINT.MENSAGEM.ENTIDADE_LISTADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(PRINT.ROTAS.ID)
  @ApiGetByIdDoc(PRINT.OPERACAO.PORID, PrintResponse)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.printService.porId(id);

    return ResponseBuilder.status<PrintResponse>(HttpStatus.OK)
      .message(PRINT.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idPrint))
      .build();
  }

  @Post()
  @ApiPostDoc(PRINT.OPERACAO.SALVAR, PrintRequest, PrintResponse)
  async salvar(@Body() printRequest: PrintRequest, @Req() req: Request) {
    const response = await this.printService.salvar(printRequest);

    return ResponseBuilder.status<PrintResponse>(HttpStatus.OK)
      .message(PRINT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idPrint))
      .build();
  }

  @Put(PRINT.ROTAS.ID)
  @ApiPutDoc(PRINT.OPERACAO.ATUALIZAR, PrintRequest, PrintResponse)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() printRequest: PrintRequest,
    @Req() req: Request,
  ) {
    const response = await this.printService.atualizar(id, printRequest);

    return ResponseBuilder.status<PrintResponse>(HttpStatus.OK)
      .message(PRINT.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idPrint))
      .build();
  }

  @Delete(PRINT.ROTAS.ID)
  @ApiDeleteDoc(PRINT.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.printService.excluir(id);

    return ResponseBuilder.status<PrintResponse>(HttpStatus.OK)
      .message(PRINT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
