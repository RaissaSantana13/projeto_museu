import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class EmailException extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.CONFLICT,
      message,
      error: error ?? 'Conflito de e-mail',
    });
  }
}
