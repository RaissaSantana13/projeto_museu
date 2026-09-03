import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'user';
const ALIAS_NAME = 'Usuário';

export const USUARIO = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  REGISTER: '/register',

  TABLE_FIELDS: {
    ID_USUARIO: 'id_usuario',
    FIRSTNAME: 'firstname',
    LASTNAME: 'lastname',
    USERNAME: 'username',
    EMAIL_VERIFIED: 'emailverified',
    ACTIVE: 'active',
    IMAGE_PATH: 'image_path',
  },

  FIELDS: {
    ID_USUARIO: 'idUsuario',
    FIRSTNAME: 'firstname',
    LASTNAME: 'lastname',
    USERNAME: 'username',
    EMAIL_VERIFIED: 'emailverified',
    ACTIVE: 'active',
    IMAGE_PATH: 'image_path',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idUsuario`,
  },

  SWAGGER: {
    ID_USUARIO: `Código do ${ALIAS_NAME} de identificação única `,
    FIRSTNAME: `Primeiro nome do ${ALIAS_NAME} `,
    LASTNAME: `Último nome do ${ALIAS_NAME}`,
    USERNAME: `Nome de acesso do ${ALIAS_NAME}`,
    EMAIL: `E-mail do ${ALIAS_NAME} `,
    EMAIL_VERIFIED: `E-mail do ${ALIAS_NAME} confirmado`,
    PASSWORD: `Senha de acesso do ${ALIAS_NAME}`,
    CONFIRM_PASSWORD: `Senha de confirmação do ${ALIAS_NAME}`,
    ACTIVE: `Status do ${ALIAS_NAME} no sistema `,
    IMAGE_PATH: `Imagem - Foto do ${ALIAS_NAME} no sistema `,
    ROLE: `IDs das roles / papéis atribuídas ao ${ALIAS_NAME}`,
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
    SERVER_ERROR: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),
    TOKEN_INVALIDO_EXPIRADO: gerarMensagem(
      MENSAGEM_GENERICA.TOKEN_INVALIDO_EXPIRADO,
      ALIAS,
    ),
  };
}

function getRotas(ENTITY: string): RotaRecurso {
  return gerarRotaRecurso(ENTITY);
}

export const fieldsUsuario = Object.values(USUARIO.FIELDS);
