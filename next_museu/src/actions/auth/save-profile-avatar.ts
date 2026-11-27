'use server';

import { requestProfileAvatar } from '@/lib/profile-avatar';

export async function saveProfileAvatar(data: FormData) {
  const image = data.get('image');
  if (!(image instanceof File) || !image.size || image.size > 768 * 1024) {
    return { success: false };
  }

  const body = new FormData();
  body.set('image', image, 'avatar');

  try {
    const response = await requestProfileAvatar(body);
    return { success: response?.status === 204 };
  } catch {
    return { success: false };
  }
}
