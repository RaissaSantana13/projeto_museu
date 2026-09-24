import { AtualizarPermissions } from "@/components/permissions/atualizar-permissions";
import { notFound, redirect } from "next/navigation";
import { PermissionsResponse } from "../../../../../schemas/permissions-schemas";
import { PermissionsService } from "../../../../../service/connection/PermissionsService";
import { getResource } from "../../../../../service/connection/RecursosService";
import { ApiResponse } from "../../../../../type/api";
import { listarRecursos } from "../../../../../lib/dashboard/listar-recursos";
import { listarRoles } from "../../../../../lib/dashboard/listar-roles";

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

async function getPorId(
  id: string,
): Promise<ApiResponse<PermissionsResponse>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();

    endpoint = resources
      .find((r) => r.name === "permissions" && r.endpoint.includes(":id"))
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
    const permissionsService = new PermissionsService(endpoint);
    const data = await permissionsService.porId(id);
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

export default async function PermissionsAtualizar({
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

  const resources = await listarRecursos(
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

  return (
    <AtualizarPermissions
      result={result}
      idPermissions={id}
      roles={roles}
      resources={resources}
    />
  );
}
