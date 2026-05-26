export enum MENSAGEM_GENERICA {
  ENTIDADE_NAO_ENCONTRADA = 'ENTIDADE_NAO_ENCONTRADA',
  EMAIL_CADASTRADO = 'EMAIL_CADASTRADO',
  EMAIL_NAO_CADASTRADO = 'EMAIL_NAO_CADASTRADO',
  EMAIL_RECUPERACAO_ENVIADO = 'EMAIL_RECUPERACAO_ENVIADO',
  EMAIL_LOCALIZADO_NO_SISTEMA = 'EMAIL_LOCALIZADO_NO_SISTEMA',
  EMAIL_NAO_CONFIRMADO_NO_SISTEMA = 'EMAIL_NAO_CONFIRMADO_NO_SISTEMA',
  EMAIL_CONFIRMADO_NO_SISTEMA = 'EMAIL_CONFIRMADO_NO_SISTEMA',
  FALHA_SERVICO_EMAIL = 'FALHA_SERVICO_EMAIL',
  ENTIDADE_CADASTRADA = 'ENTIDADE_CADASTRADA',
  ENTIDADE_ALTERADA = 'ENTIDADE_ALTERADA',
  ENTIDADE_EXCLUIDA = 'ENTIDADE_EXCLUIDA',
  ENTIDADE_LOCALIZADA = 'ENTIDADE_LOCALIZADA',
  ENTIDADE_LISTADA = 'ENTIDADE_LISTADA',
  ENTIDADE_RESTAURADA = 'ENTIDADE_RESTAURADA',
  ENTIDADE_JA_ATIVA = 'ENTIDADE_JA_ATIVA',
  CREDENCIAL_INVALIDA = 'CREDENCIAL_INVALIDA',
  LOGIN_EFETUADO = 'LOGIN_EFETUADO',
  ERROR_SERVICE = 'ERROR_SERVICE',
  CREDENTIALS_UPDATE_SUCCESS = 'CREDENTIALS_UPDATE_SUCCESS',
  TOKEN_INVALIDO_EXPIRADO = 'TOKEN_INVALIDO_EXPIRADO',
  ACTIVATION_CODE_EXPIRED = 'ACTIVATION_CODE_EXPIRED',
  ACTIVATION_CODE_INVALID = 'ACTIVATION_CODE_INVALID',
  MAX_ATTEMPTS_EXCEEDED = 'MAX_ATTEMPTS_EXCEEDED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_REQUIRED = 'SESSION_REQUIRED',
  SESSION_INVALID = 'SESSION_INVALID',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  FORBIDDEN = 'FORBIDDEN',
  CANNOT_MODIFY_SELF = 'CANNOT_MODIFY_SELF',
  OAUTH_AUTHENTICATION_FAILED = 'OAUTH_AUTHENTICATION_FAILED',
  SAME_PASSWORD = 'SAME_PASSWORD',
  INVALID_OAUTH_PROVIDER = 'INVALID_OAUTH_PROVIDER',
  OAUTH_INVALID_CODE = 'OAUTH_INVALID_CODE',

  GOOGLE_TOKEN_INVALID = 'GOOGLE_TOKEN_INVALID',
  GOOGLE_TOKEN_EXPIRED = 'GOOGLE_TOKEN_EXPIRED',
  GOOGLE_NOT_CONFIGURED = 'GOOGLE_NOT_CONFIGURED',
  GOOGLE_EMAIL_NOT_VERIFIED = 'GOOGLE_EMAIL_NOT_VERIFIED',

  GITHUB_CODE_INVALID = 'GITHUB_CODE_INVALID',
  GITHUB_CODE_EXPIRED = 'GITHUB_CODE_EXPIRED',
  GITHUB_NOT_CONFIGURED = 'GITHUB_NOT_CONFIGURED',
  GITHUB_EMAIL_NOT_VERIFIED = 'GITHUB_EMAIL_NOT_VERIFIED',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',

  FACEBOOK_CODE_INVALID = 'FACEBOOK_CODE_INVALID',
  FACEBOOK_CODE_EXPIRED = 'FACEBOOK_CODE_EXPIRED',
  FACEBOOK_NOT_CONFIGURED = 'FACEBOOK_NOT_CONFIGURED',
  FACEBOOK_EMAIL_NOT_VERIFIED = 'FACEBOOK_EMAIL_NOT_VERIFIED',
  FACEBOOK_API_ERROR = 'FACEBOOK_API_ERROR',
}

type MensagemValor = string | ((...args: any[]) => string);

type MensagensGenericas = {
  [key in MENSAGEM_GENERICA]: MensagemValor;
};

const MENSAGENS_GENERICAS: MensagensGenericas = {
  [MENSAGEM_GENERICA.ENTIDADE_NAO_ENCONTRADA]: (entidade: string) =>
    `${entidade} não localizado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_CADASTRADA]: (entidade: string) =>
    `${entidade} foi cadastrado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_ALTERADA]: (entidade: string) =>
    `${entidade} foi alterado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_EXCLUIDA]: (entidade: string) =>
    `${entidade} foi excluído(a) no sistema.`,
  [MENSAGEM_GENERICA.EMAIL_CADASTRADO]: (entidade: string) =>
    `O endereço de e-mail do(a) ${entidade} já está cadastrado no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_LOCALIZADA]: (entidade: string) =>
    `${entidade} foi localizado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_LISTADA]: (entidade: string) =>
    `Listagem de ${entidade} gerada com sucesso.`,
  [MENSAGEM_GENERICA.ENTIDADE_RESTAURADA]: (entidade: string) =>
    `${entidade} foi restaurado(a) no sistema.`,
  [MENSAGEM_GENERICA.ENTIDADE_JA_ATIVA]: (entidade: string) =>
    `${entidade} já está ativo(a) no sistema.`,
  [MENSAGEM_GENERICA.EMAIL_NAO_CADASTRADO]: (entidade: string) =>
    `${entidade} não está cadastrada no sistema.`,
  [MENSAGEM_GENERICA.EMAIL_RECUPERACAO_ENVIADO]: (entidade: string) =>
    `${entidade} de recuperação enviado.`,
  [MENSAGEM_GENERICA.EMAIL_LOCALIZADO_NO_SISTEMA]: (entidade: string) =>
    `Se o ${entidade} existir, as instruções foram enviadas.`,
  [MENSAGEM_GENERICA.EMAIL_NAO_CONFIRMADO_NO_SISTEMA]: () =>
    `O e-mail não está confirmado no sistema, pendência na confirmação.`,
  [MENSAGEM_GENERICA.EMAIL_CONFIRMADO_NO_SISTEMA]: () =>
    `O e-mail já está confirmado no sistema.`,
  [MENSAGEM_GENERICA.FALHA_SERVICO_EMAIL]: (entidade: string) =>
    `Falha no serviço de ${entidade}.`,
  [MENSAGEM_GENERICA.CREDENCIAL_INVALIDA]: () =>
    `As credenciais de acesso estão inválidas.`,
  [MENSAGEM_GENERICA.LOGIN_EFETUADO]: (entidade: string) =>
    `${entidade} efetuado com sucesso.`,
  [MENSAGEM_GENERICA.ERROR_SERVICE]: () => `Erro de processamento no servidor.`,
  [MENSAGEM_GENERICA.CREDENTIALS_UPDATE_SUCCESS]: () =>
    `Credenciais atualizadas com sucesso.`,
  [MENSAGEM_GENERICA.TOKEN_INVALIDO_EXPIRADO]: () =>
    `Token inválido ou expirado.`,
  [MENSAGEM_GENERICA.ACTIVATION_CODE_EXPIRED]: () =>
    'O código de ativação expirou.',
  [MENSAGEM_GENERICA.ACTIVATION_CODE_INVALID]: () =>
    'Código de ativação inválido.',
  [MENSAGEM_GENERICA.MAX_ATTEMPTS_EXCEEDED]: () =>
    'Limite máximo de tentativas excedido.',
  [MENSAGEM_GENERICA.SESSION_REQUIRED]: () =>
    'Autenticação requerida. Por favor, faça login.',
  [MENSAGEM_GENERICA.SESSION_EXPIRED]: () =>
    'Sua sessão expirou. Por favor, faça login novamente.',
  [MENSAGEM_GENERICA.SESSION_INVALID]: () =>
    'Sua sessão está inválida. Por favor, faça login novamente.',
  [MENSAGEM_GENERICA.VALIDATION_ERROR]: () =>
    'Erro de validação nos dados enviados.',
  [MENSAGEM_GENERICA.RATE_LIMIT_EXCEEDED]: () =>
    'Limite de requisições excedido. Tente mais tarde.',
  [MENSAGEM_GENERICA.FORBIDDEN]: () =>
    'Você não tem permissão para acessar este recurso.',
  [MENSAGEM_GENERICA.CANNOT_MODIFY_SELF]: () =>
    'Não é permitido alterar o próprio perfil/status através desta rota.',
  [MENSAGEM_GENERICA.OAUTH_AUTHENTICATION_FAILED]: (entidade: string) =>
    `Falha na autenticação via ${entidade}.`,
  [MENSAGEM_GENERICA.SAME_PASSWORD]: () =>
    'A nova senha não pode ser igual à senha atual.',
  [MENSAGEM_GENERICA.INVALID_OAUTH_PROVIDER]: () =>
    'O token de ID OAuth do provedor especificado é inválido.',
  [MENSAGEM_GENERICA.OAUTH_INVALID_CODE]: () =>
    'O token de ID OAuth é inválido ou expirado.',
  [MENSAGEM_GENERICA.GOOGLE_TOKEN_INVALID]: () =>
    'O token de ID do Google é inválido.',
  [MENSAGEM_GENERICA.GOOGLE_TOKEN_EXPIRED]: () =>
    'O token de ID do Google expirou.',
  [MENSAGEM_GENERICA.GOOGLE_NOT_CONFIGURED]: () =>
    'Google OAuth não configurado.',
  [MENSAGEM_GENERICA.GOOGLE_EMAIL_NOT_VERIFIED]: () =>
    'O e-mail do Google não está verificado.',
  [MENSAGEM_GENERICA.GITHUB_CODE_INVALID]: () =>
    'O código de autorização do GitHub é inválido.',
  [MENSAGEM_GENERICA.GITHUB_CODE_EXPIRED]: () =>
    'O código de autorização do GitHub expirou.',
  [MENSAGEM_GENERICA.GITHUB_NOT_CONFIGURED]: () =>
    'GitHub OAuth não configurado.',
  [MENSAGEM_GENERICA.GITHUB_EMAIL_NOT_VERIFIED]: () =>
    'O e-mail do GitHub não está verificado.',
  [MENSAGEM_GENERICA.GITHUB_API_ERROR]: () => 'Erro na API do GitHub.',
  [MENSAGEM_GENERICA.FACEBOOK_CODE_INVALID]: () =>
    'O código de autorização do Facebook é inválido.',
  [MENSAGEM_GENERICA.FACEBOOK_CODE_EXPIRED]: () =>
    'O código de autorização do Facebook expirou.',
  [MENSAGEM_GENERICA.FACEBOOK_NOT_CONFIGURED]: () =>
    'Facebook OAuth não configurado.',
  [MENSAGEM_GENERICA.FACEBOOK_EMAIL_NOT_VERIFIED]: () =>
    'O e-mail do Facebook não está verificado.',
  [MENSAGEM_GENERICA.FACEBOOK_API_ERROR]: () => 'Erro na API do Facebook.',
};

export function gerarMensagem(
  chave: MENSAGEM_GENERICA,
  ...params: any[]
): string {
  const mensagem = MENSAGENS_GENERICAS[chave];

  if (typeof mensagem === 'function') {
    return mensagem(...params);
  }

  return mensagem;
}
