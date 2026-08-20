import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PARAMS } from '../../../commons/constants/param.constants';
import { SIS_MUSEU } from '../../../commons/enum/sis-museu.enum';
import { HateoasHelper } from '../../../commons/helpers/hateoas.helpers';
import { ApiResponse, Link } from '../../../commons/response/api.response';
import { ResponseBuilder } from '../../../commons/response/builder.response';
import { EVENT_SPOTLIGHT } from '../constants/event_spotlight.constants';
import { EventSpotlightRequest } from '../dto/event_spotlight/request/event_spotlight.request';
import { EventSpotlightResponse } from '../dto/event_spotlight/response/event_spotlight.response';
import { EventSpotlightService } from '../service/event_spotlight.service';

@ApiTags(EVENT_SPOTLIGHT.ALIAS)
@Controller(EVENT_SPOTLIGHT.ROTAS.BASE)
export class EventSpotlightController {
  private readonly path = `${SIS_MUSEU.ROTA_VERSIONAMENTO}/${EVENT_SPOTLIGHT.ROTAS.BASE}`;

  constructor(private readonly eventSpotlightService: EventSpotlightService) {}

  @Post()
  async salvar(
    @Body() eventSpotlightRequest: EventSpotlightRequest,
    @Req() req: Request,
  ) {
    const response = await this.eventSpotlightService.salvar(
      eventSpotlightRequest,
    );
    return ResponseBuilder.status<EventSpotlightResponse>(HttpStatus.OK)
      .message(EVENT_SPOTLIGHT.MENSAGEM.ENTIDADE_CADASTRADA)
      .path(req.path)
      .data(response)
      .metodo(req.method)
      .links(this.eventSpotlightLinks())
      .build();
  }

  @Get()
  async listar(
    @Req() req: Request,
  ): Promise<ApiResponse<EventSpotlightResponse[]>> {
    const response = await this.eventSpotlightService.listar();
    return ResponseBuilder.status<EventSpotlightResponse[]>(HttpStatus.OK)
      .path(req.path)
      .message(EVENT_SPOTLIGHT.MENSAGEM.ENITDADE_LISTADA)
      .data(response)
      .metodo(req.method)
      .links(this.eventSpotlightLinks())
      .build();
  }

  @Delete(EVENT_SPOTLIGHT.ROTAS.ID)
  async excluir(
    @Param(PARAMS.ID, ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    await this.eventSpotlightService.excluir(id);

    return ResponseBuilder.status<EventSpotlightResponse>(HttpStatus.OK)
      .message(EVENT_SPOTLIGHT.MENSAGEM.ENTIDADE_EXCLUIDA)
      .path(req.path)
      .metodo(req.method)
      .links(this.eventSpotlightLinks())
      .build();
  }

  private eventSpotlightLinks(): Record<string, Link> {
    return HateoasHelper.generateResourceLinks(this.path);
  }
}
