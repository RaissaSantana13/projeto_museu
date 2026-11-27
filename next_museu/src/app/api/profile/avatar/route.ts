import { requestProfileAvatar } from '@/lib/profile-avatar';

const cacheHeaders = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  try {
    const upstream = await requestProfileAvatar();
    if (!upstream || upstream.status === 401 || upstream.status === 403) {
      return new Response(null, { status: 401, headers: cacheHeaders });
    }
    if (upstream.status === 404) {
      return new Response(null, { status: 404, headers: cacheHeaders });
    }
    if (upstream.ok && upstream.headers.get('content-type') === 'image/jpeg') {
      return new Response(upstream.body, {
        headers: {
          ...cacheHeaders,
          'Content-Type': 'image/jpeg',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  } catch {
    // The client keeps its fallback avatar when the API is unavailable.
  }
  return new Response(null, { status: 502, headers: cacheHeaders });
}
