import { criarMensagensOperacao } from '../../../commons/constants/constants.entity';
import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';
import {
  gerarRotaRecurso,
  RotaRecurso,
} from '../../../commons/constants/url.sistema';

const ENTITY_NAME = 'contacts';
const ALIAS_NAME = 'Contato';

export const CONTACT = {
  ENTITY: ENTITY_NAME,

  ALIAS: ALIAS_NAME,

  TABLE_FIELDS: {
    ID_CONTACT: 'id_contact',
    FIRST_NAME: 'first_name',
    LAST_NAME: 'last_name',
    PHONE: 'phone',
    EMAIL: 'email',
    MESSAGE: 'message',
    AGREED_TO_PRIVACY: 'agreed_to_privacy',
  },

  FIELDS: {
    ID_CONTACT: 'idContact',
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    PHONE: 'phone',
    EMAIL: 'email',
    MESSAGE: 'message',
    AGREED_TO_PRIVACY: 'agreed_to_privacy',
  },

  SEARCH: {
    POR_ID: `${ENTITY_NAME}.idContact`,
  },

  SWAGGER: {
    ID_CONTACT: `Código do ${ALIAS_NAME} de identificação única `,
    FIRST_NAME: `Nome do usuário no ${ALIAS_NAME}`,
    LAST_NAME: `Sobrenome do usuário no ${ALIAS_NAME}`,
    EMAIL: `E-mail do usuário no ${ALIAS_NAME}`,
    PHONE: `Telefone de acesso do usuário no ${ALIAS_NAME}`,
    MESSAGE: `Mensagem do usuário no ${ALIAS_NAME}`,
    AGREED_TO_PRIVACY: `Termo de concordância do usuário no ${ALIAS_NAME} no sistema `,
    STATUS: `Situação do ${ALIAS_NAME} no sistema `,
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

export const fieldsContact = Object.values(CONTACT.FIELDS);
