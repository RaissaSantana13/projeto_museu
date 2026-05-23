import { HttpException } from '@nestjs/common';

export interface ExceptionPayload {
  statusCode: number;
  message: string;
  error?: string | null;
}

export class NegocioException extends HttpException {
  constructor(payload: ExceptionPayload) {
    super(payload, payload.statusCode);
  }
}
