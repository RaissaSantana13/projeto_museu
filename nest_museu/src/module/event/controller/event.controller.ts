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
import { SIS_MUSEU } from '../../../commons/enum/sis-museu.enum';
import { HateoasHelper } from '../../../commons/helpers/hateoas.helpers';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { EVENT } from '../constants/event.constantes';
import { EventRequest } from '../dto/request/event.request';
import { EventResponse } from '../dto/response/event.response';
import { EventService } from '../service/event.service';

@ApiTags(EVENT.ALIAS)
@Controller(EVENT.ROTAS.BASE)
export class EventController {
  private readonly path = `${SIS_MUSEU.ROTA_VERSIONAMENTO}/${EVENT.ROTAS.BASE}`;
  constructor(private readonly eventService: EventService) {}
  @Get()
  @ApiGetDoc(EVENT.OPERACAO.LISTAR, EventResponse)
  @ApiPaginationQuery()
  @ApiPaginatedResponse(EventResponse)
  async listar(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string, // Nova query
    @Query('endDate') endDate?: string, // Nova query
  ): Promise<ApiResponse<EventResponse[]>> {
    const response = await this.eventService.listar(search, startDate, endDate);
    return ResponseBuilder.status<EventResponse[]>(HttpStatus.OK)
      .path(req.path)
      .message(EVENT.MENSAGEM.ENITDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.eventLinks())
      .build();
  }

  @Get(EVENT.ROTAS.ID)
  async porId(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    const response = await this.eventService.porId(id);
    return ResponseBuilder.status<EventResponse>(HttpStatus.OK)
      .message(EVENT.MENSAGEM.ENTIDADE_LOCALIZADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.eventLinks(response?.idEvent))
      .build();
  }

  @Post()
  async salvar(@Body() eventRequest: EventRequest, @Req() req: Request) {
    const response = await this.eventService.salvar(eventRequest);
    return ResponseBuilder.status<EventResponse>(HttpStatus.OK)
      .message(EVENT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.eventLinks())
      .build();
  }

  @Put(EVENT.ROTAS.ID)
  async atualizar(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Body() eventRequest: EventRequest,
    @Req() req: Request,
  ) {
    const response = await this.eventService.atualizar(id, eventRequest);
    return ResponseBuilder.status<EventResponse>(HttpStatus.OK)
      .message(EVENT.MENSAGEM.ENTIDADE_ALTERADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.eventLinks(response?.idEvent))
      .build();
  }

  @Delete(EVENT.ROTAS.ID)
  excluir(@Param(PARAMS.ID, ParseIntPipe) id: number, @Req() req: Request) {
    this.eventService.excluir(id);

    return ResponseBuilder.status<EventResponse>(HttpStatus.OK)
      .message(EVENT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.eventLinks())
      .build();
  }

  private eventLinks(id?: number): Record<string, Link> {
    const resourceLinks = HateoasHelper.generateResourceLinks(this.path);
    return resourceLinks;
  }

  private eventPageLinks(req: Request, page: Page<any>): Record<string, Link> {
    const paginationLinks = HateoasHelper.generatePaginationLinks(
      req,
      page,
      this.path,
    );
    return paginationLinks;
  }
}
