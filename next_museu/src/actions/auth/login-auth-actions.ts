'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { parse } from 'set-cookie-parser';
import { getServerDictionary } from '../../lib/get-dictionary';
import { LoginResponse } from '../../schemas/sigin-schemas';
import { AuthService } from '../../service/connection/AuthService';
import { ApiResponse } from '../../type/api';

export async function loginAuthAction(
  prevState: ApiResponse<LoginResponse>,
  payload: {
    loginRequest: {
      email: string;
      password: string;
    };
  },
): Promise<ApiResponse<LoginResponse>> {
  const dict = await getServerDictionary();
  const url = process.env.API_AUTH_SESSION_URL;

  if (!url) {
    return {
      status: 400,
      mensagem: dict.app.endpoint.message,
      erro: dict.app.endpoint.error,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const service = new AuthService(url);
    const { body, setCookies } = await service.signInWithCookies(
      payload.loginRequest,
    );

    if (body.status >= 200 && body.status < 300) {
      const cookieStore = await cookies();
      for (const c of parse(setCookies, { decodeValues: false })) {
        cookieStore.set(c.name, c.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: c.maxAge,
        });
      }
      revalidatePath('/dashboard');
    }

    return body;
  } catch (error: any) {
    const apiError = error as ApiResponse<never> & { isNetworkError?: boolean };

    return {
      status: apiError.status || 503,
      mensagem: apiError.mensagem || dict.app.endpoint.api_message,
      erro: apiError.erro || dict.app.endpoint.api_error,
      timestamp: new Date().toISOString(),
      isNetworkError: apiError.isNetworkError ?? false,
    } as ApiResponse<LoginResponse> & { isNetworkError: boolean };
  }
}
