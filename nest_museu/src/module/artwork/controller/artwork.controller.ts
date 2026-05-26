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
import { ArtworkRequest } from '../dto/request/artwork.request';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';

@Crud({
  model: { type: Artwork },
  dto: {
    create: ArtworkRequest,
    update: ArtworkRequest,
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
  @ApiPaginatedResponse(ArtworkResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto, // Recebe o objeto de paginação unificado do commons
  ): Promise<ApiResponse<Page<ArtworkResponse>>> {
    const pageController = Number(pagination.page)
      ? Number(pagination.page)
      : PAGINATION.PAGE;
    const pageSizeController = Number(pagination.pageSize)
      ? Number(pagination.pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = pagination.field
      ? pagination.field
      : ARTWORK.FIELDS.ID_ARTWORK;
    const orderController = pagination.order
      ? pagination.order
      : PAGINATION.ASC;
    const searchController = pagination.search;

    const response = await this.artworkService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      searchController,
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
  @ApiGetByIdDoc(ARTWORK.OPERACAO.PORID, ArtworkResponse)
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

  @Patch(`${ARTWORK.ROTAS.ID}/recover`)
  @ApiRestoreDoc(ARTWORK.OPERACAO.RESTAURAR)
  async restaurar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.artworkService.restaurar(id);

    return ResponseBuilder.status<ArtworkResponse>(HttpStatus.OK)
      .message(ARTWORK.MENSAGEM.ENTIDADE_RESTAURADA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
