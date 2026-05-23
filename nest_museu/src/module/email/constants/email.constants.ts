import {
  gerarMensagem,
  MENSAGEM_GENERICA,
} from '../../../commons/constants/mensagem.sistema';

const ENTITY_NAME = 'email';
const ALIAS_NAME = 'EMAIL';

export const EMAIL = {
  ENTITY: ENTITY_NAME,
  ALIAS: ALIAS_NAME,

  MENSAGEM: getMensagem(ALIAS_NAME),
};

function getMensagem(ALIAS: string) {
  return {
    FALHA_SERVICO_EMAIL: gerarMensagem(
      MENSAGEM_GENERICA.FALHA_SERVICO_EMAIL,
      ALIAS,
    ),
  };
}
