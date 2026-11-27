'use server';

import { http } from '@/lib/http';

export async function confirmEmailAction(
  token: string,
): Promise<'success' | 'error' | 'unavailable'> {
  if (typeof token !== 'string' || !token.trim() || token.length > 4096) {
    return 'error';
  }

  try {
    await http.post(
      '/api/v1/credentials/confirm-email',
      { token },
      { maxRedirects: 0 },
    );
    return 'success';
  } catch (error) {
    const status = (error as { status?: number }).status;
    return status === 400 || status === 401 || status === 422
      ? 'error'
      : 'unavailable';
  }
}
