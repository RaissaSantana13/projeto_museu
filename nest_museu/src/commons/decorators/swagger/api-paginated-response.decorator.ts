import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          content: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          totalPages: {
            type: 'number',
            example: 100,
          },
          totalElements: {
            type: 'number',
            example: 10,
          },
          pageSize: {
            type: 'number',
            example: 5,
          },
          page: {
            type: 'number',
            example: 1,
          },
          lastPage: {
            type: 'number',
            example: 100,
          },
        },
      },
    }),
  );
};
