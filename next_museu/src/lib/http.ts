import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../type/api';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ mensagem?: string }>) => {
    // Tipagem do erro do Axios
    const isOffline = !error.response;

    const errorPayload: ApiResponse<unknown> & { isNetworkError: boolean } = {
      status: error.response?.status || (isOffline ? 503 : 500),
      mensagem: isOffline
        ? 'Servidor indisponível.'
        : error.response?.data?.mensagem || 'Erro inesperado',
      erro: error.message,
      isNetworkError: isOffline,
    };

    return Promise.reject(errorPayload);
  },
);
