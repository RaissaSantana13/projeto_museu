import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class ServerErrorExceptions extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error: error ?? 'Erro interno do servidor',
    });
  }
}
