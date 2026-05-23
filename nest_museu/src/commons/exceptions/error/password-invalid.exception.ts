import { HttpStatus } from '@nestjs/common';
import { NegocioException } from './negocio.exception';

export class PasswordInvalidExceptions extends NegocioException {
  constructor(message: string, error?: string | null) {
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: error ?? 'Credenciais inválidas',
    });
  }
}
