import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { EVENT } from '../constants/event.constants';
import { EventRequest } from '../dto/events/request/event.request';
import { RemoveColaboratorFromEventRequest } from '../dto/events/request/remove-colaborator-from-event.request';
import { EventResponse } from '../dto/events/response/event.response';
import { Colaborator } from '../entities/colaborators.entity';
import { Event } from '../entities/event.entity';
import { AddColaboratorToEventRequest } from '../dto/events/request/add-colaborator-to-event.request';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Colaborator)
    private colaboratorRepository: Repository<Colaborator>,
  ) {}

  async listar(
    search?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<EventResponse[]> {
    try {
      const query = this.eventRepository.createQueryBuilder(EVENT.ENTITY);

      if (search) {
        query.andWhere(
          `${EVENT.ENTITY}.${EVENT.TABLE_FIELDS.TITLE} ILIKE :search`,
          {
            search: `%${search}%`,
          },
        );
      }

      if (startDate && endDate) {
        query.andWhere(
          `${EVENT.ENTITY}.${EVENT.TABLE_FIELDS.START_DATE} BETWEEN :start AND :end`,
          {
            start: startDate,
            end: endDate,
          },
        );
      } else if (startDate) {
        query.andWhere(
          `${EVENT.ENTITY}.${EVENT.TABLE_FIELDS.START_DATE} >= :start`,
          {
            start: startDate,
          },
        );
      }

      const events = await query.getMany();

      const listaEvents = GenericConverter.toListResponse(
        EventResponse,
        events,
      );

      return listaEvents;
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async porId(id: number): Promise<EventResponse | null> {
    const event = await this.buscarPorId(id);

    if (!event) {
      throw new EntityNotFoundException(EVENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    return GenericConverter.toResponse(EventResponse, event);
  }

  async salvar(eventRequest: EventRequest): Promise<EventResponse> {
    try {
      const novoEvent = GenericConverter.toEntity(Event, eventRequest);

      const eventSalvo = await this.eventRepository.save(novoEvent);

      return GenericConverter.toResponse(EventResponse, eventSalvo);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao criar usuário: ${error.message}`,
      );
    }
  }

  async atualizar(
    id: number,
    eventRequest: EventRequest,
  ): Promise<EventResponse | null> {
    const eventCadastrado = await this.buscarPorId(id);

    if (!eventCadastrado) {
      throw new EntityNotFoundException(EVENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    try {
      const dadosNovos = GenericConverter.toEntity(Event, eventRequest);
      const eventParaSalvar = Object.assign(eventCadastrado, dadosNovos);
      const eventExistente = await this.eventRepository.save(eventParaSalvar);

      return GenericConverter.toResponse(EventResponse, eventExistente);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao processar: ${error.message}`,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const event = await this.buscarPorId(id);

      if (!event) {
        throw new EntityNotFoundException(
          EVENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.eventRepository.remove(event);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async buscarPorId(id: number): Promise<Event> {
    try {
      const event = await this.eventRepository
        .createQueryBuilder(EVENT.ENTITY)
        .where(`${EVENT.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!event) {
        throw new EntityNotFoundException(
          EVENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return event;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async adicionarColaborador(
    request: AddColaboratorToEventRequest,
  ): Promise<EventResponse> {
    const event = await this.buscarEventoComColaboradores(request.id_event);
    const colaborator = await this.colaboratorRepository.findOne({
      where: { idColaborator: request.id_colaborator },
    });

    if (!colaborator) {
      throw new EntityNotFoundException('Colaborador não encontrado');
    }

    const alreadyRelated = event.colaborators.some(
      (item) => item.idColaborator === colaborator.idColaborator,
    );

    if (!alreadyRelated) {
      event.colaborators.push(colaborator);
      await this.eventRepository.save(event);
    }

    return GenericConverter.toResponse(EventResponse, event);
  }

  async removerColaborador(
    request: RemoveColaboratorFromEventRequest,
  ): Promise<EventResponse> {
    const event = await this.buscarEventoComColaboradores(request.id_event);
    const colaborator = await this.colaboratorRepository.findOne({
      where: { idColaborator: request.id_colaborator },
    });

    if (!colaborator) {
      throw new EntityNotFoundException('Colaborador não encontrado');
    }

    event.colaborators = event.colaborators.filter(
      (item) => item.idColaborator !== colaborator.idColaborator,
    );
    await this.eventRepository.save(event);

    return GenericConverter.toResponse(EventResponse, event);
  }

  private async buscarEventoComColaboradores(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { idEvent: id },
      relations: ['colaborators'],
    });

    if (!event) {
      throw new EntityNotFoundException(EVENT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA);
    }

    return event;
  }
}
