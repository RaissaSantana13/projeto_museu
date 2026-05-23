import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'events';
const ALIAS_NAME = 'Evento';

export const EVENT = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_EVENT: 'id_event',
    TITLE: 'title',
    DESCRIPTION: 'description',
    START_DATE: 'start_date',
    START_TIME: 'start_time',
    END_DATE: 'end_date',
    DURATION_MINUTES: 'duration_minutes',
    ALLDAY: 'all_day',
    LOCATION: 'location',
    COLOR: 'color',
  },

  FIELDS: {
    ID_EVENT: 'idEvent',
    TITLE: 'title',
    DESCRIPTION: 'description',
    START: 'start_date',
    START_TIME: 'start_time',
    DURATION_MINUTES: 'duration_minutes',
    END: 'end_date',
    ALLDAY: 'all_day',
    LOCATION: 'location',
    COLOR: 'color',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idContact`,
  },

  SWAGGER: {
    ID_EVENT: `Código do ${ALIAS_NAME} de identificação única `,
    TITLE: `Nome do evento no ${ALIAS_NAME}`,
    DESCRIPTION: `Descrição do evento no ${ALIAS_NAME}`,
    START: `Data de início do ${ALIAS_NAME}`,
    START_TIME: `Hora de início do ${ALIAS_NAME}`,
    DURATION_MINUTES: `Duração do ${ALIAS_NAME}`,
    END: `Data final do ${ALIAS_NAME}`,
    ALLDAY: `Valor lógico do ${ALIAS_NAME} se ocorre todos os dias `,
    LOCATION: `Local de realização de ${ALIAS_NAME} no sistema `,
    COLOR: `Status do ${ALIAS_NAME} no sistema `,
  },

  MENSAGEM: getMensagem(ALIAS_NAME),

  ROTAS: getRotas(ENTITY_NAME.toLowerCase()),

  OPERACAO: criarMensagensOperacao(ALIAS_NAME),
} as const;

function getMensagem(ALIAS: string) {
  return {
    ENTIDADE_CADASTRADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_CADASTRADA,
      ALIAS,
    ),
    ENTIDADE_NAO_ENCONTRADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_NAO_ENCONTRADA,
      ALIAS,
    ),
    EMAIL_CADASTRADO: gerarMensagem(MENSAGEM_GENERICA.EMAIL_CADASTRADO, ALIAS),
    ENTIDADE_ALTERADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_ALTERADA,
      ALIAS,
    ),
    ENTIDADE_EXCLUIDA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_EXCLUIDA,
      ALIAS,
    ),
    ENTIDADE_LOCALIZADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_LOCALIZADA,
      ALIAS,
    ),
    ENITDADE_LISTADA: gerarMensagem(MENSAGEM_GENERICA.ENTIDADE_LISTADA, ALIAS),
  };
}

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}

export const fieldsEvent = Object.values(EVENT.FIELDS);
