import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';

const ENTITY_NAME = 'credentials';
const ALIAS_NAME = 'Credenciais';

export const AUTH = {
  ENTITY: ENTITY_NAME,
  ALIAS: ALIAS_NAME,

  DATABASE_TABLE: 'LOGIN',

  TABLE_FIELDS: {
    ID_LOGIN: 'id_login',
    ID_USUARIO: 'id_usuario',
    EMAIL: 'email',
    PASSWORD: 'password',
  },

  FIELDS: {
    ID_LOGIN: 'idLogin',
    id_USUARIO: 'idUsuario',
    EMAIL: 'email',
    PASSWORD: 'password',
  },

  SWAGGER: {
    ID_USUARIO: `Código do Usuário de identificação única `,
    EMAIL: `E-mail do usuário ${ALIAS_NAME}`,
    PASSWORD: `Senha do usuário no ${ALIAS_NAME}`,
    USERNAME: `Nome do usuário`,
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idLogin`,
    POR_USUARIO: `${ENTITY_NAME}.idUsuario`,
    POR_EMAIL: `${ENTITY_NAME}.email`,
  },

  MENSAGEM: getMensagem(ALIAS_NAME),

  OPERACAO: criarMensagensOperacao(ENTITY_NAME),

  ROTAS: {
    BASE: `${ENTITY_NAME}`,
    SESSION: `/session`,
    SESSION_CHANGE_PASSWORDS: '/change-password',
    SESSION_PASSWORD_RESETS: '/reset-password',
    SESSION_PASSWORD_FORGOT: '/forgot-password',
    SESSION_ME: '/session/me',
    REGISTER: '/register',
    VERIFICATION_EMAIL: '/verification-email',
    CONFIRM_EMAIL: '/confirm-email',
    REFRESH_TOKEN: '/refresh-token',
  },
};

function getMensagem(ALIAS: string) {
  return {
    ENTIDADE_NAO_ENCONTRADA: gerarMensagem(
      MENSAGEM_GENERICA.ENTIDADE_NAO_ENCONTRADA,
      ALIAS,
    ),
    CREDENCIAL_INVALIDA: gerarMensagem(
      MENSAGEM_GENERICA.CREDENCIAL_INVALIDA,
      ALIAS,
    ),
    ERROR_SERVER: gerarMensagem(MENSAGEM_GENERICA.ERROR_SERVICE, ALIAS),

    TOKEN_INVALIDO_EXPIRADO: gerarMensagem(
      MENSAGEM_GENERICA.TOKEN_INVALIDO_EXPIRADO,
      ALIAS,
    ),
    CREDENTIALS_UPDATE_SUCCESS: gerarMensagem(
      MENSAGEM_GENERICA.CREDENTIALS_UPDATE_SUCCESS,
      ALIAS,
    ),
    EMAIL_RECUPERACAO_ENVIADO: gerarMensagem(
      MENSAGEM_GENERICA.EMAIL_RECUPERACAO_ENVIADO,
      ALIAS,
    ),
    EMAIL_LOCALIZADO_NO_SISTEMA: gerarMensagem(
      MENSAGEM_GENERICA.EMAIL_LOCALIZADO_NO_SISTEMA,
      ALIAS,
    ),
    EMAIL_NAO_CONFIRMADO_NO_SISTEMA: gerarMensagem(
      MENSAGEM_GENERICA.EMAIL_NAO_CONFIRMADO_NO_SISTEMA,
      ALIAS,
    ),
    EMAIL_CONFIRMADO_NO_SISTEMA: gerarMensagem(
      MENSAGEM_GENERICA.EMAIL_CONFIRMADO_NO_SISTEMA,
      ALIAS,
    ),
  };
}

export const fieldsLogin = Object.values(AUTH.FIELDS);
