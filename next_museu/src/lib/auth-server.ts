import 'server-only';
import { cookies } from 'next/headers';
import { LoginResponse } from '../schemas/sigin-schemas';
import { ApiResponse } from '../type/api';

export async function getCurrentUser(): Promise<LoginResponse | null> {
  const token = (await cookies()).get('Authentication')?.value;
  const url = process.env.API_AUTH_ME_URL;
  if (!token || !url) return null;

  try {
    const res = await fetch(url, {
      headers: { Cookie: `Authentication=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body: ApiResponse<LoginResponse> = await res.json();
    return body.dados ?? null;
  } catch {
    return null;
  }
}
