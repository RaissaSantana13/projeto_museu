import { redirect } from 'next/navigation';
import ListarPermissions from '../../../components/permissions/lista-permissions';
import { PermissionsResponse } from '../../../schemas/permissions-schemas';
import { PermissionsService } from '../../../service/connection/PermissionsService';
import { getResource } from '../../../service/connection/RecursosService';
import { ApiResponse, PageResponse } from '../../../type/api';

async function listarPermissions(
  page?: string,
  pageSize?: string,
  field?: string,
  order?: string,
  search?: string,
): Promise<ApiResponse<PageResponse<PermissionsResponse>>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();
    endpoint = resources.find(
      (r) => r.name === 'permissions' && !r.endpoint.includes(':id'),
    )?.endpoint;
  } catch (error) {
    const apiError = error as ApiResponse<never> & { isNetworkError?: boolean };
    if (apiError.isNetworkError || apiError.status === 503) {
      redirect('/status/offline');
    }
  }

  if (!endpoint) {
    redirect('/status/offline');
  }

  try {
    const permissionsService = new PermissionsService(endpoint);

    const param = {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      field,
      order,
      search,
    };

    const data = await permissionsService.listar(param);

    if (!data || !data.dados) {
      return {
        status: 400,
        timestamp: new Date().toISOString(),
        path: '',
        metodo: 'GET',
        dados: {
          content: [],
          totalPages: 0,
          totalElements: 0,
          pageSize: 5,
          page: 1,
          lastPage: 0,
        },
      };
    }
    return data;
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;

    const apiError = error as ApiResponse<never> & { isNetworkError?: boolean };

    if (apiError.isNetworkError || apiError.status === 503) {
      redirect('/status/offline');
    }

    return apiError;
  }
}

export default async function ListarPermissionsPage({
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
  const result = await listarPermissions(
    params.page,
    params.pageSize,
    params.field,
    params.order,
    params.search,
  );

  return <ListarPermissions result={result} />;
}
