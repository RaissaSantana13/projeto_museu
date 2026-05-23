import { Crud } from '@nestjsx/crud';
import { BaseController } from '../../../commons/entities/base.controller';
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { ArtworkMedia } from '../entities/artwork-media.entity';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ArtworkMediaResponse } from '../dto/response/artwork-media.response';
import { ApiResponse, Link } from '../../../commons/response/api.response';
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
import { ARTWORK_MEDIA } from '../constants/artwork-media.constants';
import { PARAMS } from '../../../commons/constants/param.constants';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import { ApiPaginationQuery } from '../../../commons/decorators/swagger/api-pagination-query.decorator';
import {
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
  ApiDeleteDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { ArtworkMediaRequest } from '../dto/request/artwork-media.request';
import { ArtworkMediaService } from '../service/artwork-media.service';
import { Request } from 'express';

@Crud({
  model: { type: ArtworkMedia },
  dto: {
    create: ArtworkMediaRequest,
    update: ArtworkMediaRequest,
  },
  ...GLOBAL_CRUD_OPTIONS,
})
@ApiTags(ARTWORK_MEDIA.ALIAS)
@ApiExtraModels(ApiResponse, ArtworkMediaResponse, Link)
@Controller(ARTWORK_MEDIA.ROTAS.BASE)
export class ArtworkMediaController extends BaseController {
  protected readonly entityPath = ARTWORK_MEDIA.ROTAS.BASE;

  constructor(private readonly artworkMediaService: ArtworkMediaService) {
    super();
  }

  @Get()
  @ApiGetDoc(ARTWORK_MEDIA.OPERACAO.LISTAR, ArtworkMediaResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(ArtworkMediaResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<ArtworkMediaResponse>>> {
    const pageController = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : ARTWORK_MEDIA.FIELDS.ID_MEDIA;
    const orderController = order ? order : PAGINATION.ASC;

    const response = await this.artworkMediaService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );

    return ResponseBuilder.status<Page<ArtworkMediaResponse>>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_LISTADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(ARTWORK_MEDIA.ROTAS.ID)
  @ApiGetDoc(ARTWORK_MEDIA.OPERACAO.PORID, ArtworkMediaResponse)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.artworkMediaService.porId(id);

    return ResponseBuilder.status<ArtworkMediaResponse>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idMedia))
      .build();
  }

  @Post()
  @ApiPostDoc(
    ARTWORK_MEDIA.OPERACAO.SALVAR,
    ArtworkMediaRequest,
    ArtworkMediaResponse,
  )
  async salvar(
    @Body() artworkMediaRequest: ArtworkMediaRequest,
    @Req() req: Request,
  ) {
    const response = await this.artworkMediaService.salvar(artworkMediaRequest);

    return ResponseBuilder.status<ArtworkMediaResponse>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idMedia))
      .build();
  }

  @Put(ARTWORK_MEDIA.ROTAS.ID)
  @ApiPutDoc(
    ARTWORK_MEDIA.OPERACAO.ATUALIZAR,
    ArtworkMediaRequest,
    ArtworkMediaResponse,
  )
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() artworkMediaRequest: ArtworkMediaRequest,
    @Req() req: Request,
  ) {
    const response = await this.artworkMediaService.atualizar(
      id,
      artworkMediaRequest,
    );

    return ResponseBuilder.status<ArtworkMediaResponse>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idMedia))
      .build();
  }

  @Delete(ARTWORK_MEDIA.ROTAS.ID)
  @ApiDeleteDoc(ARTWORK_MEDIA.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.artworkMediaService.excluir(id);

    return ResponseBuilder.status<any>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
