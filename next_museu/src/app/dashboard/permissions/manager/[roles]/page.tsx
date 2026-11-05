import { listarRoles } from '@/lib/dashboard/listar-roles';
import { notFound, redirect } from 'next/navigation';

export default async function MatrizPermission({
  params,
}: {
  params: Promise<{ roles: string }>;
}) {
  const { roles } = await params;

  const roleId = Number(roles);
  if (Number.isSafeInteger(roleId) && roleId > 0) {
    redirect(`/dashboard/permissions/${roleId}/manager`);
  }

  const result = await listarRoles('1', '100', undefined, undefined, roles);
  const role = result.dados?.content?.find(
    (item) => item.nomeRoles === roles,
  );

  if (!role) {
    notFound();
  }

  redirect(`/dashboard/permissions/${role.idRoles}/manager`);
}
