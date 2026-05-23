import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseBuilder } from '../../response/builder.response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let error: string | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const r = response as any;

        // Lógica específica para campos extras do ValidationPipe
        const isWhitelistError =
          Array.isArray(r.message) &&
          r.message.some((msg: string) => msg.includes('should not exist'));

        if (isWhitelistError) {
          message = 'Payload contém campos não permitidos';
          error = error = r.message.join(', ');
        } else {
          message = r.message ?? message;
          error = r.error ?? null;
        }
      } else {
        message = response;
      }
    }
    const body = ResponseBuilder.status(status)
      .message(message)
      .error(error ?? null)
      .path(req.path)
      .metodo(req.method)
      .build();

    return res.status(status).json(body);
  }
}
