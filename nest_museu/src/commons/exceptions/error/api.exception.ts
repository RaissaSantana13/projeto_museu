import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class ApiException extends NegocioException {
  constructor(
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    message: string,
    error?: string | null,
  ) {
    super({
      statusCode,
      message,
      error: error ?? 'Erro de negócio',
    });
  }
}
