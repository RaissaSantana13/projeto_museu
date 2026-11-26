import { cookies } from 'next/headers';
import { http } from './http';

export const SESSION_PATH = '/api/v1/credentials/session';
export const SESSION_COOKIE = 'Authentication';
export const REFRESH_COOKIE = 'Refresh';

export function sessionRequestConfig(token: string) {
  return {
    headers: { Cookie: `${SESSION_COOKIE}=${encodeURIComponent(token)}` },
    maxRedirects: 0,
  };
}

export async function hasActiveSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const response = await http.get(
      `${SESSION_PATH}/me`,
      sessionRequestConfig(token),
    );
    return response.status === 200;
  } catch {
    return false;
  }
}
