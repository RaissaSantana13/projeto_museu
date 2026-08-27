import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'documents';
const ALIAS_NAME = 'Documento';

export const DOCUMENT = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_DOC: 'id_doc',
    TITLE: 'title',
    ORIGIN: 'origin',
    CREATION_YEAR: 'creation_year',
    DESCRIPTION: 'description',
    DIMENSIONS: 'dimensions',
    TYPE: 'type',
    CATEGORY: 'category',
    LOCATION: 'location',
    ID_PRINT: 'id_print',
    STATUS: 'status',
  },

  FIELDS: {
    ID_DOC: 'idDoc',
    TITLE: 'title',
    ORIGIN: 'origin',
    CREATION_YEAR: 'creationYear',
    DESCRIPTION: 'description',
    DIMENSIONS: 'dimensions',
    TYPE: 'type',
    CATEGORY: 'category',
    LOCATION: 'location',
    ID_PRINT: 'idPrint',
    STATUS: 'status',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idDoc`,
  },

  SWAGGER: {
    ID_DOC: `Código de identificação única do ${ALIAS_NAME}`,
    TITLE: `Título do ${ALIAS_NAME}`,
    ORIGIN: `Origem/procedência do ${ALIAS_NAME}`,
    CREATION_YEAR: `Ano de criação do ${ALIAS_NAME}`,
    DESCRIPTION: `Texto descritivo do ${ALIAS_NAME}`,
    DIMENSIONS: `Dimensões físicas do ${ALIAS_NAME}`,
    TYPE: `Tipo do ${ALIAS_NAME}`,
    CATEGORY: `Categoria do ${ALIAS_NAME}`,
    LOCATION: `Localização de acervo do ${ALIAS_NAME}`,
    ID_PRINT: `Código do Material Impresso associado ao ${ALIAS_NAME}`,
    STATUS: `Status atual do ${ALIAS_NAME}`,
  },

  STATUS_DEFAULT: 'disponivel',

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

export const fieldsDocument = Object.values(DOCUMENT.FIELDS);
