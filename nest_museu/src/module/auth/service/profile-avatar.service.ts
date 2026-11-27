import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { mediaStorageRoot } from '../../artwork-media/storage/media-storage';

export const PROFILE_AVATAR_MAX_BYTES = 768 * 1024;

@Injectable()
export class ProfileAvatarService {
  private readonly folder: string;

  constructor(config: ConfigService) {
    this.folder = join(
      mediaStorageRoot(config.get<string>('MEDIA_STORAGE_ROOT')),
      'profile-avatars',
    );
  }

  async read(userId: number) {
    try {
      return await readFile(join(this.folder, `${userId}.jpg`));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async save(userId: number, input: Buffer) {
    let avatar: Buffer;
    try {
      const image = sharp(input, { limitInputPixels: 25_000_000 });
      const { format } = await image.metadata();
      if (format !== 'jpeg' && format !== 'png' && format !== 'webp') {
        throw new Error('Unsupported format');
      }

      avatar = await image
        .rotate()
        .resize(384, 384, { fit: 'cover' })
        .flatten({ background: '#fff' })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch {
      throw new BadRequestException('Envie uma imagem JPEG, PNG ou WebP válida.');
    }

    await mkdir(this.folder, { recursive: true });
    const temporary = join(this.folder, `${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, avatar, { flag: 'wx', mode: 0o600 });
      await rename(temporary, join(this.folder, `${userId}.jpg`));
    } finally {
      await rm(temporary, { force: true });
    }
  }
}
