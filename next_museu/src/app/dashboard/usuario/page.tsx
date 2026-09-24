import { redirect } from 'next/navigation';
import ListarUsuarios from '../../../components/usuario/lista-usuario';
import { UsuarioResponse } from '../../../schemas/usuario-schemas';
import { getResource } from '../../../service/connection/RecursosService';
import { UsuarioService } from '../../../service/connection/UsuarioService';
import { ApiResponse, PageResponse } from '../../../type/api';

async function listarUsuario(
  page?: string,
  pageSize?: string,
  field?: string,
  order?: string,
  search?: string,
): Promise<ApiResponse<PageResponse<UsuarioResponse>>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();
    endpoint = resources.find(
      (r) => r.name === 'usuario' && !r.endpoint.includes(':id'),
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
    const usuarioService = new UsuarioService(endpoint);

    const param = {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      field,
      order,
      search,
    };

    const data = await usuarioService.listar(param);

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

export default async function ListarUsuariosPage({
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
  const result = await listarUsuario(
    params.page,
    params.pageSize,
    params.field,
    params.order,
    params.search,
  );
  return <ListarUsuarios result={result} />;
}
