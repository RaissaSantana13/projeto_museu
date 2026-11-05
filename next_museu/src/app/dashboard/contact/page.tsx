
import { redirect } from 'next/navigation';
import ListarContact from '../../../components/contact/lista-contato';
import { ContactResponse } from '../../../schemas/contact-schema';
import { ContactService } from '../../../service/connection/ContactService';
import { getResource } from '../../../service/connection/RecursosService';
import { ApiResponse, PageResponse } from '../../../type/api';

async function listarContact(
  page?: string,
  pageSize?: string,
  field?: string,
  order?: string,
  search?: string,
): Promise<ApiResponse<PageResponse<ContactResponse>>> {
  let endpoint: string | undefined;

  try {
    const resources = await getResource();
    endpoint = resources.find(
      (resource) =>
        resource.name === 'contact' && !resource.endpoint.includes(':id'),
    )?.endpoint;
  } catch (error) {
    const apiError = error as ApiResponse<never> & {
      isNetworkError?: boolean;
    };
    if (apiError.isNetworkError || apiError.status === 503) {
      redirect('/status/offline');
    }
    throw error;
  }

  if (!endpoint) {
    redirect('/status/offline');
  }

  const contactService = new ContactService(endpoint);
  const param = {
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    field,
    order,
    search,
  };

  const data = await contactService.listar(param);
  if (!data?.dados) {
    return {
      status: 200,
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
}

export default async function ListarContactPage({
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
  const result = await listarContact(params.page, params.pageSize, params.field, params.order, params.search);
  return <ListarContact result={result} />;
}
