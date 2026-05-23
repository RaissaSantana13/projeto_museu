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
import { SCHOOL } from '../constants/school.constants';
import { SchoolRequest } from '../dto/request/school.request';
import { SchoolResponse } from '../dto/response/school.response';
import { School } from '../entities/school.entity';
import { SchoolService } from '../service/school.service';

@Crud({
  model: { type: School },
  ...GLOBAL_CRUD_OPTIONS,
})
@ApiTags(SCHOOL.ALIAS)
@ApiExtraModels(ApiResponse, SchoolResponse, Link)
@Controller(SCHOOL.ROTAS.BASE)
export class SchoolController extends BaseController {
  protected readonly entityPath = SCHOOL.ROTAS.BASE;

  constructor(private readonly schoolService: SchoolService) {
    super();
  }

  @Get()
  @ApiGetDoc(SCHOOL.OPERACAO.LISTAR, SchoolResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(SchoolResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<SchoolResponse>>> {
    const pageControler = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : SCHOOL.FIELDS.ID_SCHOOL;
    const orderController = order ? order : PAGINATION.ASC;

    const response = await this.schoolService.listar(
      pageControler,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );

    return ResponseBuilder.status<Page<SchoolResponse>>(HttpStatus.OK)
      .path(req.path)
      .message(SCHOOL.MENSAGEM.ENTIDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(SCHOOL.ROTAS.ID)
  @ApiGetDoc(SCHOOL.OPERACAO.PORID, SchoolResponse)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.schoolService.porId(id);
    return ResponseBuilder.status<SchoolResponse>(HttpStatus.OK)
      .message(SCHOOL.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idSchool))
      .build();
  }

  @Post()
  @ApiPostDoc(SCHOOL.OPERACAO.SALVAR, SchoolRequest, SchoolResponse)
  async salvar(@Body() schoolRequest: SchoolRequest, @Req() req: Request) {
    const response = await this.schoolService.salvar(schoolRequest);
    return ResponseBuilder.status<SchoolResponse>(HttpStatus.OK)
      .message(SCHOOL.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idSchool))
      .build();
  }

  @Put(SCHOOL.ROTAS.ID)
  @ApiPutDoc(SCHOOL.OPERACAO.ATUALIZAR, SchoolRequest, SchoolResponse)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() schoolRequest: SchoolRequest,
    @Req() req: Request,
  ) {
    const response = await this.schoolService.atualizar(id, schoolRequest);
    return ResponseBuilder.status<SchoolResponse>(HttpStatus.OK)
      .message(SCHOOL.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idSchool))
      .build();
  }

  @Delete(SCHOOL.ROTAS.ID)
  @ApiDeleteDoc(SCHOOL.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.schoolService.excluir(id);
    return ResponseBuilder.status<SchoolResponse>(HttpStatus.OK)
      .message(SCHOOL.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks())
      .build();
  }
}
