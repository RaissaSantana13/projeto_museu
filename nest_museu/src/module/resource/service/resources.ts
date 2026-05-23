import { SIS_MUSEU } from '../../../commons/enum/sis-museu.enum';
import { PERMISSIONS } from '../../access/constants/permissions.constants';
import { RESOURCES } from '../../access/constants/resources.constants';
import { ROLES } from '../../access/constants/roles.constants';
import { ACCOUNT } from '../../auth/constants/accounts.constants';
import { AUTH } from '../../auth/constants/login.constants';
import { SESSION } from '../../auth/constants/session.constants';
import { CONTACT } from '../../contact/constants/contact.constantes';
import { EVENT } from '../../event/constants/event.constants';
import { FOTO } from '../../imagem/constants/foto.constants';
import { USUARIO } from '../../usuario/constants/usuario.constantes';

type VERBO_HTTP = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Resource {
  name: string;
  endpoint: string;
  method: VERBO_HTTP[];
}

const ENTITY = [
  USUARIO.ENTITY,
  ACCOUNT.ENTITY,
  EVENT.ENTITY,
  SESSION.ENTITY,
  CONTACT.ENTITY,
  FOTO.ENTITY,
  ROLES.ENTITY,
  PERMISSIONS.ENTITY,
  RESOURCES.ENTITY,
];

export const Resources: Resource[] = [
  ...ENTITY.flatMap((entity) => buildResource(entity)),
  ...buildAuthResources(),
  ...buildPermissionsResources(),
];

export function buildResource(entityName: string): Resource[] {
  const entityPath = entityName.toLowerCase();
  return [
    {
      name: entityName,
      endpoint: endPointBase(entityPath),
      method: ['GET'],
    },
    {
      name: entityName,
      endpoint: endPointBase(entityPath),
      method: ['POST'],
    },
    {
      name: entityName,
      endpoint: endPointId(entityPath),
      method: ['GET'],
    },
    {
      name: entityName,
      endpoint: endPointId(entityPath),
      method: ['PUT'],
    },
    {
      name: entityName,
      endpoint: endPointId(entityPath),
      method: ['DELETE'],
    },
  ];
}

export function buildAuthResources(): Resource[] {
  const sessionPath = `${AUTH.ENTITY}/${AUTH.ROTAS.SESSION}`;
  const resetPasswordPath = `${AUTH.ROTAS.BASE}/${AUTH.ROTAS.SESSION_PASSWORD_RESETS}`;
  const changePasswordPath = `${AUTH.ROTAS.BASE}/${AUTH.ROTAS.SESSION_CHANGE_PASSWORDS}`;
  const registerPath = `${AUTH.ENTITY}/register`;
  const me = `${AUTH.ROTAS.BASE}/${AUTH.ROTAS.SESSION_ME}`;
  const refreshToken = `${AUTH.ROTAS.BASE}/${AUTH.ROTAS.REFRESH_TOKEN}`;
  const forgotPassword = `${AUTH.ROTAS.BASE}/${AUTH.ROTAS.SESSION_PASSWORD_FORGOT}`;
  return [
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(sessionPath),
      method: ['POST'],
    }, // Login
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(sessionPath),
      method: ['DELETE'],
    }, // Logout
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(refreshToken),
      method: ['PUT'],
    }, // Refresh
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(me),
      method: ['GET'],
    }, // Perfil
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(forgotPassword),
      method: ['POST'],
    }, // Forgot Password
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(resetPasswordPath),
      method: ['PUT'],
    }, // Reset Password
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(changePasswordPath),
      method: ['PUT'],
    }, // change Password
    {
      name: `${AUTH.ENTITY}`,
      endpoint: endPointBase(registerPath),
      method: ['POST'],
    }, // register user
  ];
}

export function buildPermissionsResources(): Resource[] {
  const path = `${PERMISSIONS.ENTITY}/sync/:roleId`;
  return [
    {
      name: `${PERMISSIONS.ENTITY}`,
      endpoint: endPointBase(path),
      method: ['POST'],
    },
  ];
}

function endPointBase(entityPath: string): string {
  return `/${SIS_MUSEU.ROTA_VERSIONAMENTO}/${entityPath}`;
}

function endPointId(entityPath: string): string {
  return `/${SIS_MUSEU.ROTA_VERSIONAMENTO}/${entityPath}/:id`;
}
