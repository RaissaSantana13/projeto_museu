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
import { ARTWORK } from '../constants/artwork.constants';
import { ArtworkService } from '../service/artwork.service';
import { Crud } from '@nestjsx/crud';
import { Artwork } from '../entities/artwork.entity';
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ArtworkResponse } from '../dto/response/artwork.response';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import {
  ApiDeleteDoc,
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { ApiPaginationQuery } from '../../../commons/decorators/swagger/api-pagination-query.decorator';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { Request } from 'express';
import { PARAMS } from '../../../commons/constants/param.constants';
import { ArtworkRequest } from '../dto/request/artwork.request';

@Crud({
  model: { type: Artwork },
  ...GLOBAL_CRUD_OPTIONS,
})
@ApiTags(ARTWORK.ALIAS)
@ApiExtraModels(ApiResponse, ArtworkResponse, Link)
@Controller(ARTWORK.ROTAS.BASE)
export class ArtworkController extends BaseController {
  protected readonly entityPath = ARTWORK.ROTAS.BASE;

  constructor(private readonly artworkService: ArtworkService) {
    super();
  }

  @Get()
  @ApiGetDoc(ARTWORK.OPERACAO.LISTAR, ArtworkResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(ArtworkResponse)
  async listar(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('field') field?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<ApiResponse<Page<ArtworkResponse>>> {
    const pageController = Number(page) ? Number(page) : PAGINATION.PAGE;
    const pageSizeController = Number(pageSize)
      ? Number(pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = field ? field : ARTWORK.FIELDS.ID_ARTWORK;
    const orderController = order ? order : PAGINATION.ASC;

    const response = await this.artworkService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      search,
    );

    return ResponseBuilder.status<Page<ArtworkResponse>>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_LISTADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getCollectionLinks(req, response))
      .build();
  }

  @Get(ARTWORK.ROTAS.ID)
  @ApiGetDoc(ARTWORK.OPERACAO.PORID, ArtworkResponse)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.artworkService.porId(id);

    return ResponseBuilder.status<ArtworkResponse>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idArtwork))
      .build();
  }

  @Post()
  @ApiPostDoc(ARTWORK.OPERACAO.SALVAR, ArtworkRequest, ArtworkResponse)
  async salvar(@Body() artworkRequest: ArtworkRequest, @Req() req: Request) {
    const response = await this.artworkService.salvar(artworkRequest);

    return ResponseBuilder.status<ArtworkResponse>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idArtwork))
      .build();
  }

  @Put(ARTWORK.ROTAS.ID)
  @ApiPutDoc(ARTWORK.OPERACAO.ATUALIZAR, ArtworkRequest, ArtworkResponse)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() artworkRequest: ArtworkRequest,
    @Req() req: Request,
  ) {
    const response = await this.artworkService.atualizar(id, artworkRequest);

    return ResponseBuilder.status<ArtworkResponse>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idArtwork))
      .build();
  }

  @Delete(ARTWORK.ROTAS.ID)
  @ApiDeleteDoc(ARTWORK.OPERACAO.EXCLUIR)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.artworkService.excluir(id);

    return ResponseBuilder.status<ArtworkResponse>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
