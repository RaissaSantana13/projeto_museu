import { redirect } from 'next/navigation';
import { ResourcesResponse } from '../../schemas/resources-schemas';
import { getResource } from '../../service/connection/RecursosService';
import { ResourcesService } from '../../service/connection/ResourcesService';
import { ApiResponse, PageResponse } from '../../type/api';

export async function listarRecursos(
  page?: string,
  pageSize?: string,
  field?: string,
  order?: string,
  search?: string,
): Promise<ApiResponse<PageResponse<ResourcesResponse>>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();
    endpoint = resources.find(
      (resource) => resource.name === 'resources' && !resource.endpoint.includes(':id'),
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
    const resourcesService = new ResourcesService(endpoint);
    const data = await resourcesService.listar({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      field,
      order,
      search,
    });

    if (!data || !data.dados) {
      return {
        status: 400,
        timestamp: new Date().toISOString(),
        path: '',
        metodo: 'GET',
        dados: { content: [], totalPages: 0, totalElements: 0, pageSize: 5, page: 1, lastPage: 0 },
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
