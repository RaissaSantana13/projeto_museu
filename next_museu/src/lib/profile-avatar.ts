import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_PATH, sessionRequestConfig } from './auth-session';

export async function requestProfileAvatar(body?: FormData) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const url = new URL(
    process.env.API_AUTH_ME_URL ||
      `${SESSION_PATH}/me`,
    process.env.API_INTERNAL_URL ?? 'http://localhost:3000',
  );
  url.pathname = `${url.pathname.replace(/\/$/, '')}/avatar`;

  return fetch(url, {
    method: body ? 'PUT' : 'GET',
    body,
    headers: sessionRequestConfig(token).headers,
    cache: 'no-store',
    redirect: 'error',
  });
}
