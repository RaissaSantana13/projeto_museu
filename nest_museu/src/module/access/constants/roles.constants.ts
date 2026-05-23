import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'roles';
const ALIAS_NAME = 'Roles';

export const ROLES = {
  ENTITY: ENTITY_NAME,
  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_ROLE: 'id_role',
    NOME_ROLE: 'nome_role',
  },

  FIELDS: {
    ID_ROLE: 'idRole',
    NOME_ROLE: 'nomeRole',
  },

  SWAGGER: {
    ID_ROLE: `Código da ${ALIAS_NAME} de identificação único `,
    NOME_ROLE: `Nome da ${ALIAS_NAME}`,
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idRoles`,
  },

  MENSAGEM: getMensagem(ALIAS_NAME),

  ROTAS: getRotas(ENTITY_NAME.toLowerCase()),

  OPERACAO: criarMensagensOperacao(ENTITY_NAME),
};

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
    SERVER_ERROR: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),
  };
}

export const fieldsRole = Object.values(ROLES.FIELDS);

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}
