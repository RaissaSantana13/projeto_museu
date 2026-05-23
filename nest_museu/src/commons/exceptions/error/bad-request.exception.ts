import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class BadRequestException extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: error ?? 'Erros nos dados enviados pelo cliente',
    });
  }
}
