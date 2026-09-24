import { SalvarUsuario } from "../../../../components/usuario/salvar-usuario";
import { listarRoles } from "../../../../lib/dashboard/listar-roles";

export default async function UsuarioSalvar({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    field?: string;
    order?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const result = await listarRoles(
    params.page,
    params.pageSize,
    params.field,
    params.order,
    params.search,
  );
  return <SalvarUsuario roles={result} />;
}
