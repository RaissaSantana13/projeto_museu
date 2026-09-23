import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import { catchError } from 'rxjs';

/** Remove arquivos gravados pelo Multer quando validação ou persistência falha. */
@Injectable()
export class UploadCleanupInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UploadCleanupInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      catchError(async (error: unknown) => {
        const files = request.file
          ? [request.file]
          : Object.values(request.files || {}).flat();
        await Promise.all(
          files.map(async (file) => {
            if (!file.path) return;
            try {
              await unlink(file.path);
            } catch (cleanupError) {
              if ((cleanupError as NodeJS.ErrnoException).code !== 'ENOENT') {
                this.logger.error(
                  'Falha ao remover upload incompleto',
                  cleanupError,
                );
              }
            }
          }),
        );
        throw error;
      }),
    );
  }
}
