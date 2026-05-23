import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'permissions';
const ALIAS_NAME = 'Permissions';

export const PERMISSIONS = {
  ENTITY: ENTITY_NAME,
  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_PERMISSIONS: 'id_permissions',
    NOME_PERMISSIONS: 'nome_permissions',
    ACTION: 'action',
    POSSESSION: 'possession',
  },

  FIELDS: {
    ID_PERMISSIONS: 'idPermissions',
    NOME_PERMISSIONS: 'nomePermissions',
    ACTION: 'action',
    POSSESSION: 'possession',
  },

  SWAGGER: {
    ID_PERMISSIONS: `Código da ${ALIAS_NAME} de identificação único `,
    NOME_PERMISSIONS: `Nome da ${ALIAS_NAME}`,
    ACTION: `utorização realizada no registro da ${ALIAS_NAME}`,
    POSSESSION: `Dono ou proprietário do registro da ${ALIAS_NAME}`,
    ROLE: `Autorização de acesso ao recurso`,
    RESOURCE: 'Recurso com autorização de acesso',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idPermissions`,
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
    ENITDADE_LISTADA: gerarMensagem(MENSAGEM_GENERICA.ENTIDADE_LISTADA, ALIAS),
    SERVER_ERROR: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),
  };
}

export const fieldsPermissions = Object.values(PERMISSIONS.FIELDS);

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}
