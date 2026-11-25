const ADMIN_ROLES = ['Administrador', 'Super Administrador'];

export function isAdmin(roles: string[] | undefined) {
  return !!roles?.some((r) => ADMIN_ROLES.includes(r));
}
