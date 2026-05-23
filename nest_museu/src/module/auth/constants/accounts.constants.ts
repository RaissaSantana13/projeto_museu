import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'account';
const ALIAS_NAME = 'Conta';

export const ACCOUNT = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  SEARCH: {
    POR_ID_ACCOUNT: `${ENTITY_NAME}.id_account`,
    POR_ID_USUARIO: `${ENTITY_NAME}.id_usuario`,
  },

  TABLE_FIELDS: {
    ID_ACCOUNT: 'id_account',
    ID_USUARIO: 'id_usuario',
    ACCOUNT_ID: 'account_id',
    PROVIDER_ID: 'provider_id',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    ACCESS_TOKEN_EXPIRES_AT: 'access_token_expires_at',
    REFRESH_TOKEN_EXPIRES_AT: 'refresh_token_expires_at',
    SCOPE: 'scope',
    PASSWORD: 'password',
  },

  FIELDS: {
    ID_ACCOUNT: 'idAccount',
    ID_USUARIO: 'idUsuario',
    ACCOUNT_ID: 'accountId',
    PROVIDER_ID: 'providerId',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    ACCESS_TOKEN_EXPIRES_AT: 'accessTokenExpiresAt',
    REFRESH_TOKEN_EXPIRES_AT: 'refreshTokenExpiresAt',
    SCOPE: 'scope',
    PASSWORD: 'password',
  },

  SWAGGER: {
    ID_ACCOUNT: `Código do ${ALIAS_NAME} de identificação única `,
    ID_USUARIO: `Código do ${ALIAS_NAME} de identificação única `,
    ACCOUNT_ID: `Código de acesso do provedor de serviço`,
    PROVIDER_ID: 'Código de acesso do provedor de serviço',
    ACCESS_TOKEN: 'Token de acesso',
    REFRESH_TOKEN: 'Validação do token de acesso',
    ACCESS_TOKEN_EXPIRES_AT: 'Data de cancelamento do token',
    REFRESH_TOKEN_EXPIRES_AT: 'Data de cancelamento do token',
    SCOPE: `Scopo de acesso do ${ALIAS_NAME}`,
    PASSWORD: `Senha deacesso de ${ENTITY_NAME}`,
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

export const fieldsAccount = Object.values(ACCOUNT.FIELDS);
