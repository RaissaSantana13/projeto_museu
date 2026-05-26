import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'artworks';
const ALIAS_NAME = 'Obra de Arte';

export const ARTWORK = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_ARTWORK: 'id_artwork',
    TITLE: 'title',
    TYPE: 'type',
    ARTIST_NAME: 'artist_name',
    CREATION_YEAR: 'creation_year',
    DESCRIPTION: 'description',
    TECHNIQUE: 'technique',
    HEIGHT: 'height',
    WIDTH: 'width',
    DEPTH: 'depth',
    DIMENSION_UNIT: 'dimension_unit',
    ACQUISITION_DATE: 'acquisition_date',
    ACQUISITION_METHOD: 'acquisition_method',
    STATUS: 'status',
    LOCATION: 'location',
  },

  FIELDS: {
    ID_ARTWORK: 'idArtwork',
    TITLE: 'title',
    TYPE: 'type',
    ARTIST_NAME: 'artistName',
    CREATION_YEAR: 'creationYear',
    DESCRIPTION: 'description',
    TECHNIQUE: 'technique',
    HEIGHT: 'height',
    WIDTH: 'width',
    DEPTH: 'depth',
    DIMENSION_UNIT: 'dimensionUnit',
    ACQUISITION_DATE: 'acquisitionDate',
    ACQUISITION_METHOD: 'acquisitionMethod',
    STATUS: 'status',
    LOCATION: 'location',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idArtwork`,
    POR_STATUS: `${ENTITY_NAME}.status`,
  },

  SWAGGER: {
    ID_ARTWORK: `Código de identificação única da ${ALIAS_NAME}`,
    TITLE: `Título/Nome da ${ALIAS_NAME}`,
    TYPE: `Tipo ou Categoria da ${ALIAS_NAME} (Ex: Pintura, Escultura)`,
    ARTIST_NAME: `Nome do criador/artista da ${ALIAS_NAME}`,
    CREATION_YEAR: `Ano aproximado ou exato de criação da ${ALIAS_NAME}`,
    DESCRIPTION: `Texto descritivo da ${ALIAS_NAME}`,
    TECHNIQUE: `Técnica ou materiais utilizados na ${ALIAS_NAME}`,
    HEIGHT: `Altura da ${ALIAS_NAME}`,
    WIDTH: `Largura da ${ALIAS_NAME}`,
    DEPTH: `Profundidade da ${ALIAS_NAME} (aplicável a esculturas)`,
    DIMENSION_UNIT: `Unidade de medida das dimensões (Padrão: cm)`,
    ACQUISITION_DATE: `Data em que a ${ALIAS_NAME} deu entrada no museu`,
    ACQUISITION_METHOD: `Método de entrada (Ex: Doação, Prefeitura)`,
    STATUS: `Estado atual da peça (Ex: em_exibicao, no_acervo, em_restauracao)`,
    LOCATION: `Localização física real da ${ALIAS_NAME} dentro do museu`,
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

export const fieldsArtwork = Object.values(ARTWORK.FIELDS);
