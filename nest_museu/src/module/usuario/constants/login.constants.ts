export const AUTH = {
  ENTITY: 'credentials',
  TABLE_FIELDS: {
    ID_LOGIN: 'id_credentials',
    ID_USUARIO: 'id_user',
    EMAIL: 'email',
    PASSWORD: 'password',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
    DELETED_AT: 'deleted_at',
  },
} as const;

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'E-mail ou senha inválidos.',
  USER_INACTIVE: 'Usuário inativo ou não autorizado.',
  EMAIL_ALREADY_EXISTS: 'O e-mail informado já está cadastrado.',
  UNAUTHORIZED: 'Acesso não autorizado.',
} as const;
