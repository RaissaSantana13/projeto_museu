import { listarRoles } from "@/lib/dashboard/listar-roles";
import { notFound, redirect } from "next/navigation";
import { AtualizarUsuario } from "../../../../../components/usuario/atualizar-usuario";
import { UsuarioResponse } from "../../../../../schemas/usuario-schemas";
import { getResource } from "../../../../../service/connection/RecursosService";
import { UsuarioService } from "../../../../../service/connection/UsuarioService";
import { ApiResponse } from "../../../../../type/api";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    field?: string;
    order?: string;
    search?: string;
  }>;
}

async function getPorId(id: string): Promise<ApiResponse<UsuarioResponse>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();

    endpoint = resources
      .find((r) => r.name === "usuario" && r.endpoint.includes(":id"))
      ?.endpoint.replace("/:id", "");
  } catch (error) {
    const apiError = error as ApiResponse<never> & { isNetworkError?: boolean };
    if (apiError.isNetworkError || apiError.status === 503) {
      redirect("/status/offline");
    }
  }

  if (!endpoint) {
    redirect("/status/offline");
  }

  try {
    const usuarioService = new UsuarioService(endpoint);
    const data = await usuarioService.porId(id);
    return data;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;
    const apiError = error as ApiResponse<never> & { isNetworkError?: boolean };

    if (apiError.isNetworkError || apiError.status === 503) {
      redirect("/status/offline");
    }

    return apiError;
  }
}

export default async function UsuarioAtualizar({
  params,
  searchParams,
}: PageProps) {
  const resolveParams = await params;
  const resolvedSearchParams = await searchParams;

  const roles = await listarRoles(
    resolvedSearchParams.page,
    resolvedSearchParams.pageSize,
    resolvedSearchParams.field,
    resolvedSearchParams.order,
    resolvedSearchParams.search,
  );

  const { id } = resolveParams;
  const result = await getPorId(id);
  if (!result.dados) {
    notFound();
  }
  return <AtualizarUsuario result={result} idUsuario={id} />;
}
