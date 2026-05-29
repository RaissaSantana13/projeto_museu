import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'artwork_media';
const ALIAS_NAME = 'Mídia da Obra';

export const ARTWORK_MEDIA = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_MEDIA: 'id_media',
    ID_ARTWORK: 'id_artwork',
    MEDIA_TYPE: 'media_type',
    URL: 'url',
    IS_MAIN: 'is_main',
  },

  FIELDS: {
    ID_MEDIA: 'idMedia',
    ID_ARTWORK: 'idArtwork',
    MEDIA_TYPE: 'mediaType',
    URL: 'url',
    IS_MAIN: 'isMain',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idMedia`,
    POR_OBRA: `${ENTITY_NAME}.idArtwork`,
    POR_TIPO: `${ENTITY_NAME}.mediaType`,
  },

  SWAGGER: {
    ID_MEDIA: `Código de identificação única da mídia`,
    ID_ARTWORK: `Código de identificação da obra de arte vinculada`,
    MEDIA_TYPE: `Tipo do arquivo (Ex: 'imagem', '3d')`,
    URL: `Caminho de armazenamento ou URL do arquivo de mídia`,
    IS_MAIN: `Indica se esta é a imagem principal de exibição da obra`,
  },

  MENSAGEM: getMensagem(ALIAS_NAME),

  ROTAS: getRotas(ENTITY_NAME.toLowerCase()),

  OPERACAO: criarMensagensOperacao(ALIAS_NAME),
} as const;

function getMensagem(ALIAS: string) {
  return {
    ENTIDADE_JA_ATIVA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_JA_ATIVA,
      ALIAS,
    ),
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
    ENTIDADE_RESTAURADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_RESTAURADA,
      ALIAS,
    ),
    ENTIDADE_LISTADA: gerarMensagem(MENSAGEM_GENERICA.ENTIDADE_LISTADA, ALIAS),
    SERVER_ERROR: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),
  };
}

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}

export const fieldsArtworkMedia = Object.values(ARTWORK_MEDIA.FIELDS);
