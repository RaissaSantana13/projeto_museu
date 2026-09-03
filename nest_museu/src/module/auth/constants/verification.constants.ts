import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'verification';
const ALIAS_NAME = 'Verificação';

export const VERIFICATION = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID: 'id_account',
    IDENTIFIER: 'id_user',
    VALUE: 'account_id',
    EXPIRES_AT: 'access_token_expires_at',
  },

  FIELDS: {
    ID: 'idAccount',
    IDENTIFIER: 'idUsuario',
    VALUE: 'accountId',
    EXPIRES_AT: 'accessTokenExpiresAt',
  },

  SWAGGER: {
    ID: `Código do ${ALIAS_NAME} de identificação única `,
    IDENTIFIER: `Código da ${ALIAS_NAME} de identificação`,
    VALUE: `Código de ${ALIAS_NAME}`,
    EXPIRES_AT: 'O horário em que o código de ${ALIAS_NAME} expira',
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

export const fieldsAccount = Object.values(VERIFICATION.FIELDS);
