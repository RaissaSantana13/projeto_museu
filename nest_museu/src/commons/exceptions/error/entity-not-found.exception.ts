import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class EntityNotFoundException extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.NOT_FOUND,
      message: error ?? message ?? 'Entidade não existe',
    });
  }
}
