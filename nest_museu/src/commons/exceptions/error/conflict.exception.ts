import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class ConflictException extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.CONFLICT,
      message: error ?? message ?? 'Conflito de dados',
    });
  }
}
