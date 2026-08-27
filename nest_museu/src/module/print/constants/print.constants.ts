import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'prints';
const ALIAS_NAME = 'Material Impresso';

export const PRINT = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_PRINT: 'id_print',
    TITLE: 'title',
    DESCRIPTION: 'description',
    URL_PRINT: 'url_print',
  },

  FIELDS: {
    ID_PRINT: 'idPrint',
    TITLE: 'title',
    DESCRIPTION: 'description',
    URL_PRINT: 'urlPrint',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idPrint`,
  },

  SWAGGER: {
    ID_PRINT: `Código de identificação única do ${ALIAS_NAME}`,
    TITLE: `Título do ${ALIAS_NAME}`,
    DESCRIPTION: `Texto descritivo do ${ALIAS_NAME}`,
    URL_PRINT: `URL de acesso/armazenamento do arquivo do ${ALIAS_NAME}`,
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
    ENTIDADE_LISTADA: gerarMensagem(MENSAGEM_GENERICA.ENTIDADE_LISTADA, ALIAS),
    ENTIDADE_RESTAURADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_RESTAURADA,
      ALIAS,
    ),
    ENTIDADE_JA_ATIVA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_JA_ATIVA,
      ALIAS,
    ),
    SERVER_ERROR: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),
  };
}

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}

export const fieldsPrint = Object.values(PRINT.FIELDS);
