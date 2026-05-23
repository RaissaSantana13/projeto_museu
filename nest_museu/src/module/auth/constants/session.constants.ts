import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'session';
const ALIAS_NAME = 'Sessão';

export const SESSION = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_SESSION: 'id_session',
    ID_USUARIO: 'id_usuario',
    TOKEN: 'token',
    EXPIRES_AT: 'expires_at',
    IP_ADDRESS: 'ip_address',
    USER_AGENT: 'user_agent',
  },

  FIELDS: {
    ID_SESSION: 'idSession',
    ID_USUARIO: 'idUsuario',
    TOKEN: 'token',
    EXPIRES_AT: 'ExpiresAt',
    IP_ADDRESS: 'ipAddress',
    USER_AGENT: 'userAgent',
  },

  SWAGGER: {
    ID_SESSION: `Código do ${ALIAS_NAME} de identificação única `,
    ID_USUARIO: `Código do ${ALIAS_NAME} de identificação única `,
    TOKEN: 'Token de acesso',
    EXPIRES_AT: 'Data de cancelamento do token',
    IP_ADDRESS: 'Ip de acesso ',
    USER_AGENT: `Agente de Usuário do ${ALIAS_NAME}`,
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idSession`,
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

export const fieldsSession = Object.values(SESSION.FIELDS);
