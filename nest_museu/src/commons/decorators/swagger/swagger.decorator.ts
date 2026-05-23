import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';

export interface ApiOperationConfigProps {
  ACAO: string;
  SUCESSO: string;
  ERRO: string;
  NAO_LOCALIZADO?: string;
  EXISTE?: string;
}

export const JSON_APPLICATION = 'application/json';

export function ApiPostDoc(
  config: ApiOperationConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiBody({ type: request }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: config.ERRO,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno no servidor.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: config.EXISTE,
    }),
    ApiConsumes(JSON_APPLICATION),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiPutDoc(
  config: ApiOperationConfigProps,
  request: Type<any>,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiBody({ type: request }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: config.ERRO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno no servidor.',
    }),
    ApiConsumes(JSON_APPLICATION),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiGetDoc(
  config: ApiOperationConfigProps,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiParam({ name: 'id', description: 'ID único do recurso.' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
      type: response,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno no servidor.',
    }),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiListDoc(
  config: ApiOperationConfigProps,
  response: Type<any>,
) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
      type: [response],
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno no servidor.',
    }),
    ApiProduces(JSON_APPLICATION),
  );
}

export function ApiDeleteDoc(config: ApiOperationConfigProps) {
  return applyDecorators(
    ApiOperation({ summary: config.ACAO }),
    ApiParam({
      name: 'id',
      description: 'ID único do recurso a ser excluído.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: config.SUCESSO,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: config?.NAO_LOCALIZADO,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Erro interno no servidor.',
    }),
    ApiProduces(JSON_APPLICATION),
  );
}
