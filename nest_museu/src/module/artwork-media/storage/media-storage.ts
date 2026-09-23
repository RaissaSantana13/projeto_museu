import { homedir } from 'os';
import { isAbsolute, join, relative, resolve, sep } from 'path';
import { randomUUID } from 'crypto';
import { mkdir } from 'fs/promises';
import { diskStorage } from 'multer';

export function mediaStorageRoot(configured?: string): string {
  const root = configured || join(homedir(), 'museu-storage');
  if (!isAbsolute(root))
    throw new Error('MEDIA_STORAGE_ROOT deve ser absoluto.');
  const resolved = resolve(root);
  const repository = resolve(__dirname, '../../../../..');
  const location = relative(repository, resolved);
  if (
    !location ||
    (!location.startsWith(`..${sep}`) && !isAbsolute(location))
  ) {
    throw new Error('MEDIA_STORAGE_ROOT deve ficar fora do repositório.');
  }
  return resolved;
}

export function mediaDiskStorage(root: string) {
  return diskStorage({
    destination: (_req, _file, callback) => {
      const destination = join(root, 'files');
      mkdir(destination, { recursive: true }).then(
        () => callback(null, destination),
        (error: Error) => callback(error, destination),
      );
    },
    filename: (_req, file, callback) => {
      const extension =
        /\.[a-zA-Z0-9]{1,10}$/.exec(file.originalname)?.[0] || '';
      callback(null, `${randomUUID()}${extension.toLowerCase()}`);
    },
  });
}
