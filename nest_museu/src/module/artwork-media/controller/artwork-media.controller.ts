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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Request } from 'express';
import { UploadMediaRequest } from '../dto/request/upload-media.request';
import { UploadCleanupInterceptor } from '../storage/upload-cleanup.interceptor';
import { HateoasHelper } from '../../../commons/helpers/hateoas.helpers';
import { PARAMS } from '../../../commons/constants/param.constants';
import { ApiPaginatedResponse } from '../../../commons/decorators/swagger/api-paginated-response.decorator';
import {
  ApiDeleteDoc,
  ApiGetByIdDoc,
  ApiGetDoc,
  ApiPostDoc,
  ApiPutDoc,
  ApiRestoreDoc,
} from '../../../commons/decorators/swagger/swagger.decorator';
import { BaseController } from '../../../commons/entities/base.controller';
import { GLOBAL_CRUD_OPTIONS } from '../../../commons/entities/crud.options';
import { PAGINATION } from '../../../commons/enum/pagination.enum';
import { PaginationDto } from '../../../commons/pagination/pagination.dto';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { ARTWORK_MEDIA } from '../constants/artwork-media.constants';
import { ArtworkMediaRequest } from '../dto/request/artwork-media.request';
import { ArtworkMediaResponse } from '../dto/response/artwork-media.response';
import { ArtworkMedia } from '../entities/artwork-media.entity';
import { ArtworkMediaService } from '../service/artwork-media.service';

@Crud({
  model: { type: ArtworkMedia },
  dto: {
    create: ArtworkMediaRequest,
    update: ArtworkMediaRequest,
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
@ApiTags(ARTWORK_MEDIA.ALIAS)
@ApiExtraModels(ApiResponse, ArtworkMediaResponse, Link)
@Controller(['files', ARTWORK_MEDIA.ROTAS.BASE])
export class ArtworkMediaController extends BaseController {
  protected readonly entityPath = 'files';

  protected getResourceLinks(id?: number) {
    return HateoasHelper.generateResourceLinks(this.fullPath, id);
  }

  constructor(private readonly artworkMediaService: ArtworkMediaService) {
    super();
  }

  @Get()
  @ApiGetDoc(ARTWORK_MEDIA.OPERACAO.LISTAR, ArtworkMediaResponse)
  @ApiPaginatedResponse(ArtworkMediaResponse)
  async listar(
    @Req() req: Request,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<Page<ArtworkMediaResponse>>> {
    const pageController = Number(pagination.page)
      ? Number(pagination.page)
      : PAGINATION.PAGE;
    const pageSizeController = Number(pagination.pageSize)
      ? Number(pagination.pageSize)
      : PAGINATION.PAGESIZE;
    const fieldController = pagination.field
      ? pagination.field
      : ARTWORK_MEDIA.FIELDS.ID_MEDIA;
    const orderController = pagination.order
      ? pagination.order
      : PAGINATION.ASC;
    const searchController = pagination.search;

    const response = await this.artworkMediaService.listar(
      pageController,
      pageSizeController,
      fieldController,
      orderController,
      searchController,
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
  @ApiGetByIdDoc(ARTWORK_MEDIA.OPERACAO.PORID, ArtworkMediaResponse)
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

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({
    name: 'idArtwork',
    type: Number,
    required: false,
    description: 'ID opcional de uma obra existente',
  })
  @ApiQuery({
    name: 'mediaType',
    type: String,
    required: false,
    example: 'imagem',
  })
  @ApiQuery({ name: 'isMain', type: Boolean, required: false, example: false })
  @UseInterceptors(UploadCleanupInterceptor, FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query() metadata: UploadMediaRequest,
    @Req() req: Request,
  ) {
    const [response] = await this.artworkMediaService.uploadMany(
      file ? [file] : [],
      metadata,
    );

    return ResponseBuilder.status<ArtworkMediaResponse>(HttpStatus.CREATED)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(response?.idMedia))
      .build();
  }

  @Post('upload-multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiQuery({
    name: 'idArtwork',
    type: Number,
    required: false,
    description: 'Deixe vazio para arquivos independentes',
  })
  @ApiQuery({
    name: 'mediaType',
    type: String,
    required: false,
    description: 'Classificação opcional do lote',
  })
  @ApiQuery({ name: 'isMain', type: Boolean, required: false })
  @UseInterceptors(UploadCleanupInterceptor, FilesInterceptor('files'))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() metadata: UploadMediaRequest,
    @Req() req: Request,
  ) {
    const response = await this.artworkMediaService.uploadMany(files, metadata);
    return ResponseBuilder.status<ArtworkMediaResponse[]>(HttpStatus.CREATED)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .build();
  }

  @Patch(':id/metadata')
  @ApiBody({ type: UploadMediaRequest })
  async updateMetadata(
    @Param('id', ParseIntPipe) id: number,
    @Body() metadata: UploadMediaRequest,
    @Req() req: Request,
  ) {
    const response = await this.artworkMediaService.updateMetadata(
      id,
      metadata,
    );
    return ResponseBuilder.status<ArtworkMediaResponse>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
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

  @Patch(ARTWORK_MEDIA.ROTAS.ID)
  @ApiRestoreDoc(ARTWORK_MEDIA.OPERACAO.RESTAURAR)
  async restaurar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.artworkMediaService.restaurar(id);

    return ResponseBuilder.status<any>(HttpStatus.OK)
      .message(ARTWORK_MEDIA.MENSAGEM.ENTIDADE_RESTAURADA)
      .path(req.path)
      .metodo(req.method)
      .links(this.getResourceLinks(id))
      .build();
  }
}
