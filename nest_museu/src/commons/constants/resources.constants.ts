import { PERMISSIONS } from '../../module/access/constants/permissions.constants';
import { RESOURCES } from '../../module/access/constants/resources.constants';
import { ROLES } from '../../module/access/constants/roles.constants';
import { CONTACT } from '../../module/contact/constants/contact.constantes';
import { EVENT } from '../../module/event/constants/event.constantes';
import { FOTO } from '../../module/imagem/constants/foto.constants';
import { USUARIO } from '../../module/usuario/constants/usuario.constantes';

export const RESOURCES_NAME = {
  DASHBORARD_COMPONENTE: 'Dashboards',
  USUARIO_COMPONENTE: `${USUARIO.ALIAS}`,
  EVENTO_COMPONENTE: `${EVENT.ALIAS}`,
  CONTACT_COMPONENTE: `${CONTACT.ALIAS}`,
  ROLE_COMPONENTE: `${ROLES.ALIAS}`,
  PERMISSIONS_COMPONENTE: `${PERMISSIONS.ALIAS}`,
  RESOURCES_COMPONENTE: `${RESOURCES.ALIAS}`,
  FOTO_COMPONENTE: `${FOTO.ALIAS}`,
} as const;

export type ResourceName = (typeof RESOURCES_NAME)[keyof typeof RESOURCES_NAME];
