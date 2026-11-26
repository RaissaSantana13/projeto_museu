'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  REFRESH_COOKIE,
  SESSION_COOKIE,
  SESSION_PATH,
  sessionRequestConfig,
} from '@/lib/auth-session';
import { http } from '@/lib/http';

export async function logoutAuthAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await http.delete(SESSION_PATH, sessionRequestConfig(token));
    } catch {
      // Limpa a sessão local mesmo se a API estiver indisponível.
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  redirect('/');
}
