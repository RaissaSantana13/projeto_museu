import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { ResponseBuilder } from '../../response/builder.response';

@Catch(UnprocessableEntityException)
export class UnprocesseableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    const exceptionResponse = exception.getResponse() as any;
    const dados: Record<string, string[]> = {};

    let errors: ValidationError[] = [];

    if (Array.isArray(exceptionResponse)) {
      errors = exceptionResponse;
    } else if (Array.isArray(exceptionResponse?.message)) {
      if (
        exceptionResponse.message.some((m: unknown) => typeof m === 'object')
      ) {
        errors = exceptionResponse.message;
      }
    }

    for (const erro of errors) {
      if (erro?.property && erro?.constraints) {
        dados[erro.property] = Object.values(erro.constraints);
      }
    }
    const body = ResponseBuilder.status(status)
      .message('Erro na digitação dos dados')
      .path(req.path)
      .data(dados)
      .metodo(req.method)
      .build();

    return res.status(status).json(body);
  }
}
